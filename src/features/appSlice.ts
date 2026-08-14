import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppSettings, GeoLocation, TemperatureUnit, WindUnit } from "../types";

const STORAGE_KEY = "weatherly.state.v2";

interface AppState {
  settings: AppSettings;
  favorites: GeoLocation[];
  recents: GeoLocation[];
}

function loadInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupt storage
  }
  return {
    settings: { unit: "celsius", windUnit: "kmh", homeLocation: null },
    favorites: [],
    recents: [],
  };
}

const appSlice = createSlice({
  name: "app",
  initialState: loadInitialState(),
  reducers: {
    setUnit(state, action: PayloadAction<TemperatureUnit>) {
      state.settings.unit = action.payload;
    },
    setWindUnit(state, action: PayloadAction<WindUnit>) {
      state.settings.windUnit = action.payload;
    },
    setHomeLocation(state, action: PayloadAction<GeoLocation | null>) {
      state.settings.homeLocation = action.payload;
    },
    addFavorite(state, action: PayloadAction<GeoLocation>) {
      if (!state.favorites.some((f) => f.id === action.payload.id)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite(state, action: PayloadAction<number>) {
      state.favorites = state.favorites.filter((f) => f.id !== action.payload);
    },
    addRecent(state, action: PayloadAction<GeoLocation>) {
      state.recents = [
        action.payload,
        ...state.recents.filter((r) => r.id !== action.payload.id),
      ].slice(0, 12);
    },
    removeRecent(state, action: PayloadAction<number>) {
      state.recents = state.recents.filter((r) => r.id !== action.payload);
    },
  },
});

export const {
  setUnit,
  setWindUnit,
  setHomeLocation,
  addFavorite,
  removeFavorite,
  addRecent,
  removeRecent,
} = appSlice.actions;

export default appSlice.reducer;