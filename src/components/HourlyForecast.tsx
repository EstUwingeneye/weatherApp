import { getCondition } from "../lib/conditions";
import { celsiusToFahrenheit } from "../lib/units";
import type { AppSettings, HourlyEntry } from "../types";

interface Props {
  hourly: HourlyEntry[];
  settings: AppSettings;
}

export function HourlyForecast({ hourly, settings }: Props) {
  return (
    <section className="panel">
      <h2 className="panel-title">Today's forecast</h2>
      <div className="hourly-strip">
        {hourly.slice(0, 12).map((h) => {
          const condition = getCondition(h.weatherCode);
          const temp = settings.unit === "celsius" ? h.temperature : celsiusToFahrenheit(h.temperature);
          const hourLabel = new Date(h.time).toLocaleTimeString(undefined, {
            hour: "numeric",
          });
          return (
            <div className="hourly-item" key={h.time}>
              <span className="hourly-time">{hourLabel}</span>
              <span className="hourly-icon">{condition.icon}</span>
              <span className="hourly-temp">{temp}°</span>
              {h.precipitationProbability > 0 && (
                <span className="hourly-precip">{h.precipitationProbability}%</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
