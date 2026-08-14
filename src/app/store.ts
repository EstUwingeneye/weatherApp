import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../features/appSlice";
import { geocodingApi } from "../services/geocodingApi";
import { weatherApi } from "../services/weatherApi";

const STORAGE_KEY = "weatherly.state.v2";

export const store = configureStore({
  reducer: {
    app: appReducer,
    [geocodingApi.reducerPath]: geocodingApi.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(geocodingApi.middleware, weatherApi.middleware),
});

store.subscribe(() => {
  const { settings, favorites, recents } = store.getState().app;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings, favorites, recents }));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;