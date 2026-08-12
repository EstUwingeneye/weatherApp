import { getCondition } from "../lib/conditions";
import { celsiusToFahrenheit } from "../lib/weatherApi";
import type { AppSettings, DailyEntry } from "../types";

interface Props {
  daily: DailyEntry[];
  settings: AppSettings;
}

export function DailyForecast({ daily, settings }: Props) {
  const toUnit = (c: number) => (settings.unit === "celsius" ? c : celsiusToFahrenheit(c));

  const globalMin = Math.min(...daily.map((d) => d.tempMin));
  const globalMax = Math.max(...daily.map((d) => d.tempMax));
  const span = Math.max(1, globalMax - globalMin);

  return (
    <section className="panel">
      <h2 className="panel-title">7-day forecast</h2>
      <ul className="daily-list">
        {daily.map((d, idx) => {
          const condition = getCondition(d.weatherCode);
          const dayLabel =
            idx === 0
              ? "Today"
              : new Date(d.date).toLocaleDateString(undefined, { weekday: "short" });
          const left = ((d.tempMin - globalMin) / span) * 100;
          const width = ((d.tempMax - d.tempMin) / span) * 100;
          return (
            <li className="daily-row" key={d.date}>
              <span className="daily-day">{dayLabel}</span>
              <span className="daily-icon">{condition.icon}</span>
              <span className="daily-precip">
                {d.precipitationProbability > 0 ? `${d.precipitationProbability}%` : ""}
              </span>
              <span className="daily-min">{toUnit(d.tempMin)}°</span>
              <span className="daily-range-track">
                <span
                  className="daily-range-fill"
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
              </span>
              <span className="daily-max">{toUnit(d.tempMax)}°</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
