# Weatherly

A weather app built with React + TypeScript + Vite. Search any city, view current
conditions, a 12-hour forecast, and a 7-day forecast. Set a home location and star
favorites — everything is saved locally in the browser.

Weather and city-search data come from the free Open-Meteo API (open-meteo.com) —
no API key required.

## Features

- **Search** — type a city name to look it up (debounced, live results).
- **Home tab** — current temperature, "feels like," humidity, wind, visibility,
  12-hour forecast, and 7-day forecast, all on a sky backdrop that shifts with the
  actual condition and time of day.
- **Locations** — recently searched cities, with quick actions to set as home, star,
  or remove.
- **Favorites** — starred cities for one-tap access.
- **Settings** — switch between °C/°F and km/h/mph, and manage your home location.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL in your browser. An internet connection is required at
runtime since weather data is fetched live from Open-Meteo.

To build for production:

```bash
npm run build
```

## Project structure

```
src/
  components/     UI components (Sidebar, SearchBar, CurrentWeather, forecasts, views)
  context/        AppContext - persisted settings & favorites (localStorage)
  lib/            weatherApi.ts (Open-Meteo client), conditions.ts (weather code map)
  types.ts        Shared TypeScript types
```
