//import type { GeoLocation, WeatherBundle } from "../types";

//const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
//const REVERSE_URL = "https://geocoding-api.open-meteo.com/v1/reverse";
//const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}
