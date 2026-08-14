export interface GeoLocation {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  weatherCode: number;
  isDay: boolean;
  time: string;
}

export interface HourlyEntry {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  isDay: boolean;
}

export interface DailyEntry {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherBundle {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyEntry[];
  daily: DailyEntry[];
  fetchedAt: number;
}

export type TemperatureUnit = "celsius" | "fahrenheit";
export type WindUnit = "kmh" | "mph";

export interface AppSettings {
  unit: TemperatureUnit;
  windUnit: WindUnit;
  homeLocation: GeoLocation | null;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  provider: "password" | "google";
  createdAt?: string;
  updatedAt?: string;
}

export type ViewKey = "home" | "locations" | "favorites" | "settings";
