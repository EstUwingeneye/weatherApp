import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { SearchBar } from "./components/SearchBar";
import { CurrentWeather } from "./components/CurrentWeather";
import { HourlyForecast } from "./components/HourlyForecast";
import { DailyForecast } from "./components/DailyForecast";
import { LocationsView } from "./components/LocationsView";
import { FavoritesView } from "./components/FavoritesView";
import { SettingsView } from "./components/SettingsView";
import { AppProvider, useAppContext } from "./context/AppContext";
import { fetchWeather } from "./lib/weatherApi";
import type { GeoLocation, ViewKey, WeatherBundle } from "./types";

const RECENTS_KEY = "weatherly.recents.v1";
const DEFAULT_CITY: GeoLocation = {
  id: 202061,
  name: "Kigali",
  country: "Rwanda",
  admin1: "Kigali City",
  latitude: -1.94995,
  longitude: 30.05885,
  timezone: "Africa/Kigali",
};

function loadRecents(): GeoLocation[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function AppShell() {
  const { settings, isFavorite, addFavorite, removeFavorite } = useAppContext();
  const [view, setView] = useState<ViewKey>("home");
  const [activeLocation, setActiveLocation] = useState<GeoLocation>(
    settings.homeLocation ?? DEFAULT_CITY
  );
  const [bundle, setBundle] = useState<WeatherBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recents, setRecents] = useState<GeoLocation[]>(loadRecents);

  useEffect(() => {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
  }, [recents]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchWeather(activeLocation)
      .then((data) => {
        if (!cancelled) setBundle(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load weather for this location. Check your connection and try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeLocation]);

  function selectLocation(loc: GeoLocation) {
    setActiveLocation(loc);
    setView("home");
    setRecents((prev) => {
      const withoutDup = prev.filter((r) => r.id !== loc.id);
      return [loc, ...withoutDup].slice(0, 12);
    });
  }

  function removeRecent(id: number) {
    setRecents((prev) => prev.filter((r) => r.id !== id));
  }

  function toggleFavorite() {
    if (isFavorite(activeLocation.id)) {
      removeFavorite(activeLocation.id);
    } else {
      addFavorite(activeLocation);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar active={view} onChange={setView} />
      <main className="app-main">
        <header className="app-header">
          <SearchBar onSelect={selectLocation} />
        </header>

        <div className="app-content">
          {view === "home" && (
            <>
              {loading && !bundle && <div className="state-message">Loading weather…</div>}
              {error && <div className="state-message state-message--error">{error}</div>}
              {bundle && (
                <>
                  <CurrentWeather
                    bundle={bundle}
                    settings={settings}
                    isFavorite={isFavorite(activeLocation.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                  <HourlyForecast hourly={bundle.hourly} settings={settings} />
                  <DailyForecast daily={bundle.daily} settings={settings} />
                </>
              )}
            </>
          )}

          {view === "locations" && (
            <LocationsView recents={recents} onSelect={selectLocation} onRemoveRecent={removeRecent} />
          )}

          {view === "favorites" && <FavoritesView onSelect={selectLocation} />}

          {view === "settings" && <SettingsView />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
