import { Droplets, Wind, Eye, Star } from "lucide-react";
import { getCondition } from "../lib/conditions";
import { celsiusToFahrenheit, kmhToMph } from "../lib/units";
import { SkyBackground } from "./SkyBackground";
import type { AppSettings, WeatherBundle } from "../types";

interface Props {
  bundle: WeatherBundle;
  settings: AppSettings;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function CurrentWeather({ bundle, settings, isFavorite, onToggleFavorite }: Props) {
  const { location, current } = bundle;
  const condition = getCondition(current.weatherCode);

  const temp = settings.unit === "celsius" ? current.temperature : celsiusToFahrenheit(current.temperature);
  const unitLabel = settings.unit === "celsius" ? "°C" : "°F";
  const wind = settings.windUnit === "kmh" ? current.windSpeed : kmhToMph(current.windSpeed);
  const windLabel = settings.windUnit === "kmh" ? "km/h" : "mph";

  const dateLabel = new Date(current.time).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="hero-card">
      <SkyBackground condition={condition} isDay={current.isDay} />
      <div className="hero-content">
        <div className="hero-top">
          <div>
            <div className="hero-place">
              {location.name}
              {location.admin1 ? `, ${location.admin1}` : ""}
              {location.country ? `, ${location.country}` : ""}
            </div>
            <div className="hero-date">{dateLabel}</div>
          </div>
          <button
            className={`favorite-toggle ${isFavorite ? "favorite-toggle--active" : ""}`}
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="hero-temp-row">
          <span className="hero-icon">{condition.icon}</span>
          <span className="hero-temp">
            {temp}
            <span className="hero-temp-unit">{unitLabel}</span>
          </span>
        </div>
        <div className="hero-condition">{condition.label}</div>
        <div className="hero-feels">
          Feels like {settings.unit === "celsius" ? current.apparentTemperature : celsiusToFahrenheit(current.apparentTemperature)}{unitLabel}
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <Droplets size={16} />
            <span>{current.humidity}%</span>
            <small>Humidity</small>
          </div>
          <div className="hero-stat">
            <Wind size={16} />
            <span>{wind} {windLabel}</span>
            <small>Wind</small>
          </div>
          <div className="hero-stat">
            <Eye size={16} />
            <span>{current.visibility} km</span>
            <small>Visibility</small>
          </div>
        </div>
      </div>
    </div>
  );
}
