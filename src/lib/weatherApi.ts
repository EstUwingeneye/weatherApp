import type { GeoLocation, WeatherBundle } from "../types";

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE_URL = "https://geocoding-api.open-meteo.com/v1/reverse";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchCities(query: string): Promise<GeoLocation[]> {
  if (!query.trim()) return [];
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("City search failed");
  const data = await res.json();
  return (data.results ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    country: r.country ?? "",
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone ?? "auto",
  }));
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeoLocation | null> {
  const url = `${REVERSE_URL}?latitude=${lat}&longitude=${lon}&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const r = data.results?.[0];
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    country: r.country ?? "",
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone ?? "auto",
  };
}

export async function fetchWeather(location: GeoLocation): Promise<WeatherBundle> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: location.timezone || "auto",
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day,visibility,pressure_msl,uv_index",
    hourly: "temperature_2m,weather_code,precipitation_probability,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset",
    forecast_days: "7",
  });

  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("Weather fetch failed");
  const data = await res.json();

  const nowIso = data.current.time as string;
  const hourlyTimes: string[] = data.hourly.time;
  const startIdx = Math.max(0, hourlyTimes.findIndex((t) => t >= nowIso));

  const hourly = hourlyTimes.slice(startIdx, startIdx + 24).map((t, i) => ({
    time: t,
    temperature: Math.round(data.hourly.temperature_2m[startIdx + i]),
    weatherCode: data.hourly.weather_code[startIdx + i],
    precipitationProbability: data.hourly.precipitation_probability[startIdx + i] ?? 0,
    isDay: data.hourly.is_day[startIdx + i] === 1,
  }));

  const daily = (data.daily.time as string[]).map((d, i) => ({
    date: d,
    weatherCode: data.daily.weather_code[i],
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    tempMin: Math.round(data.daily.temperature_2m_min[i]),
    precipitationProbability: data.daily.precipitation_probability_max[i] ?? 0,
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
  }));

  return {
    location,
    current: {
      temperature: Math.round(data.current.temperature_2m),
      apparentTemperature: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: data.current.wind_direction_10m,
      visibility: Math.round((data.current.visibility ?? 10000) / 1000),
      pressure: Math.round(data.current.pressure_msl),
      uvIndex: Math.round(data.current.uv_index ?? 0),
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
      time: data.current.time,
    },
    hourly,
    daily,
    fetchedAt: Date.now(),
  };
}

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}
