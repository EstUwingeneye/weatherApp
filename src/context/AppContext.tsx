import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AppSettings, GeoLocation, TemperatureUnit, WindUnit } from "../types";

const STORAGE_KEY = "weatherly.state.v1";

interface StoredState {
  settings: AppSettings;
  favorites: GeoLocation[];
}

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupt storage
  }
  return {
    settings: { unit: "celsius", windUnit: "kmh", homeLocation: null },
    favorites: [],
  };
}

interface AppContextValue {
  settings: AppSettings;
  favorites: GeoLocation[];
  setUnit: (unit: TemperatureUnit) => void;
  setWindUnit: (unit: WindUnit) => void;
  setHomeLocation: (loc: GeoLocation | null) => void;
  addFavorite: (loc: GeoLocation) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setUnit = (unit: TemperatureUnit) =>
    setState((s) => ({ ...s, settings: { ...s.settings, unit } }));

  const setWindUnit = (windUnit: WindUnit) =>
    setState((s) => ({ ...s, settings: { ...s.settings, windUnit } }));

  const setHomeLocation = (homeLocation: GeoLocation | null) =>
    setState((s) => ({ ...s, settings: { ...s.settings, homeLocation } }));

  const addFavorite = (loc: GeoLocation) =>
    setState((s) =>
      s.favorites.some((f) => f.id === loc.id)
        ? s
        : { ...s, favorites: [...s.favorites, loc] }
    );

  const removeFavorite = (id: number) =>
    setState((s) => ({ ...s, favorites: s.favorites.filter((f) => f.id !== id) }));

  const isFavorite = (id: number) => state.favorites.some((f) => f.id === id);

  return (
    <AppContext.Provider
      value={{
        settings: state.settings,
        favorites: state.favorites,
        setUnit,
        setWindUnit,
        setHomeLocation,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
