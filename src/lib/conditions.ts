export interface ConditionInfo {
  label: string;
  icon: string;
  sky: "clear" | "cloudy" | "overcast" | "rain" | "storm" | "snow" | "fog";
}

// WMO Weather interpretation codes (used by Open-Meteo)
const CONDITIONS: Record<number, ConditionInfo> = {
  0: { label: "Clear sky", icon: "☀️", sky: "clear" },
  1: { label: "Mostly clear", icon: "🌤️", sky: "clear" },
  2: { label: "Partly cloudy", icon: "⛅", sky: "cloudy" },
  3: { label: "Overcast", icon: "☁️", sky: "overcast" },
  45: { label: "Fog", icon: "🌫️", sky: "fog" },
  48: { label: "Rime fog", icon: "🌫️", sky: "fog" },
  51: { label: "Light drizzle", icon: "🌦️", sky: "rain" },
  53: { label: "Drizzle", icon: "🌦️", sky: "rain" },
  55: { label: "Dense drizzle", icon: "🌧️", sky: "rain" },
  56: { label: "Freezing drizzle", icon: "🌧️", sky: "rain" },
  57: { label: "Freezing drizzle", icon: "🌧️", sky: "rain" },
  61: { label: "Light rain", icon: "🌦️", sky: "rain" },
  63: { label: "Rain", icon: "🌧️", sky: "rain" },
  65: { label: "Heavy rain", icon: "🌧️", sky: "rain" },
  66: { label: "Freezing rain", icon: "🌧️", sky: "rain" },
  67: { label: "Freezing rain", icon: "🌧️", sky: "rain" },
  71: { label: "Light snow", icon: "🌨️", sky: "snow" },
  73: { label: "Snow", icon: "❄️", sky: "snow" },
  75: { label: "Heavy snow", icon: "❄️", sky: "snow" },
  77: { label: "Snow grains", icon: "❄️", sky: "snow" },
  80: { label: "Light showers", icon: "🌦️", sky: "rain" },
  81: { label: "Showers", icon: "🌧️", sky: "rain" },
  82: { label: "Violent showers", icon: "⛈️", sky: "storm" },
  85: { label: "Snow showers", icon: "🌨️", sky: "snow" },
  86: { label: "Snow showers", icon: "❄️", sky: "snow" },
  95: { label: "Thunderstorm", icon: "⛈️", sky: "storm" },
  96: { label: "Thunderstorm + hail", icon: "⛈️", sky: "storm" },
  99: { label: "Severe thunderstorm", icon: "⛈️", sky: "storm" },
};

export function getCondition(code: number): ConditionInfo {
  return CONDITIONS[code] ?? { label: "Unknown", icon: "🌡️", sky: "cloudy" };
}
