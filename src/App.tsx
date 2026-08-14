import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { SearchBar } from "./components/SearchBar";
import { CurrentWeather } from "./components/CurrentWeather";
import { HourlyForecast } from "./components/HourlyForecast";
import { DailyForecast } from "./components/DailyForecast";
import { LocationsView } from "./components/LocationsView";
import { FavoritesView } from "./components/FavoritesView";
import { SettingsView } from "./components/SettingsView";
import { AuthPage } from "./components/AuthPage";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { useAuth } from "./context/authContextCore";
import { addFavorite, addRecent, removeFavorite } from "./features/appSlice";
import { useGetWeatherQuery } from "./services/weatherApi";
import type { GeoLocation, ViewKey } from "./types";

const DEFAULT_CITY: GeoLocation = {
  id: 202061,
  name: "Kigali",
  country: "Rwanda",
  admin1: "Kigali City",
  latitude: -1.94995,
  longitude: 30.05885,
  timezone: "Africa/Kigali",
};

export default function App() {
  const { currentUser, loading, logout } = useAuth();
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.app.settings);
  const favorites = useAppSelector((state) => state.app.favorites);

  const [view, setView] = useState<ViewKey>("home");
  const [activeLocation, setActiveLocation] = useState<GeoLocation>(
    settings.homeLocation ?? DEFAULT_CITY
  );

  // RTK Query replaces the old useEffect + fetch + loading/error state by
  // hand. It fetches automatically whenever activeLocation changes, caches
  // the result, and gives us isLoading/isError for free.
  const { data: bundle, isLoading, isError } = useGetWeatherQuery(activeLocation);

  const isFavorite = favorites.some((f) => f.id === activeLocation.id);

  function selectLocation(loc: GeoLocation) {
    setActiveLocation(loc);
    setView("home");
    dispatch(addRecent(loc));
  }

  function toggleFavorite() {
    if (isFavorite) {
      dispatch(removeFavorite(activeLocation.id));
    } else {
      dispatch(addFavorite(activeLocation));
    }
  }

  if (loading) {
    return <div className="state-message auth-loading">Preparing Weatherly...</div>;
  }

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <div className="app-shell">
      <Sidebar active={view} onChange={setView} onLogout={logout} />
      <main className="app-main">
        <header className="app-header">
          <SearchBar onSelect={selectLocation} />
        </header>

        <div className="app-content">
          {view === "home" && (
            <>
              {isLoading && !bundle && <div className="state-message">Loading weather...</div>}
              {isError && (
                <div className="state-message state-message--error">
                  Couldn't load weather for this location. Check your connection and try again.
                </div>
              )}
              {bundle && (
                <>
                  <CurrentWeather
                    bundle={bundle}
                    settings={settings}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                  />
                  <HourlyForecast hourly={bundle.hourly} settings={settings} />
                  <DailyForecast daily={bundle.daily} settings={settings} />
                </>
              )}
            </>
          )}

          {view === "locations" && <LocationsView onSelect={selectLocation} />}
          {view === "favorites" && <FavoritesView onSelect={selectLocation} />}
          {view === "settings" && <SettingsView />}
        </div>
      </main>
    </div>
  );
}
