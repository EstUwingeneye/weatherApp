import { Home } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setHomeLocation, setUnit, setWindUnit } from "../features/appSlice";

export function SettingsView() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.app.settings);

  return (
    <div className="view">
      <h1 className="view-title">Settings</h1>
      <p className="view-subtitle">Tune how Weatherly shows your weather.</p>

      <div className="settings-group">
        <h3>Temperature unit</h3>
        <div className="segmented">
          <button
            className={settings.unit === "celsius" ? "segmented-active" : ""}
            onClick={() => dispatch(setUnit("celsius"))}
          >
            Celsius (°C)
          </button>
          <button
            className={settings.unit === "fahrenheit" ? "segmented-active" : ""}
            onClick={() => dispatch(setUnit("fahrenheit"))}
          >
            Fahrenheit (°F)
          </button>
        </div>
      </div>

      <div className="settings-group">
        <h3>Wind speed unit</h3>
        <div className="segmented">
          <button
            className={settings.windUnit === "kmh" ? "segmented-active" : ""}
            onClick={() => dispatch(setWindUnit("kmh"))}
          >
            km/h
          </button>
          <button
            className={settings.windUnit === "mph" ? "segmented-active" : ""}
            onClick={() => dispatch(setWindUnit("mph"))}
          >
            mph
          </button>
        </div>
      </div>

      <div className="settings-group">
        <h3>Home location</h3>
        {settings.homeLocation ? (
          <div className="settings-home-row">
            <div className="location-card-info">
              <Home size={16} />
              <div>
                <div className="location-card-name">{settings.homeLocation.name}</div>
                <div className="location-card-meta">
                  {[settings.homeLocation.admin1, settings.homeLocation.country]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
            </div>
            <button className="text-button text-button--danger" onClick={() => dispatch(setHomeLocation(null))}>
              Clear
            </button>
          </div>
        ) : (
          <p className="view-hint">
            No home location set. Search for a city, then set it as home from the Locations tab.
          </p>
        )}
      </div>
    </div>
  );
}