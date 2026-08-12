import { Home, Star, Trash2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import type { GeoLocation } from "../types";

interface Props {
  recents: GeoLocation[];
  onSelect: (loc: GeoLocation) => void;
  onRemoveRecent: (id: number) => void;
}

export function LocationsView({ recents, onSelect, onRemoveRecent }: Props) {
  const { settings, setHomeLocation, addFavorite, removeFavorite, isFavorite } = useAppContext();

  return (
    <div className="view">
      <h1 className="view-title">Locations</h1>
      <p className="view-subtitle">Cities you've searched for recently.</p>

      {settings.homeLocation && (
        <div className="location-card location-card--home">
          <div className="location-card-info">
            <Home size={16} />
            <div>
              <div className="location-card-name">{settings.homeLocation.name}</div>
              <div className="location-card-meta">
                {[settings.homeLocation.admin1, settings.homeLocation.country].filter(Boolean).join(", ")} · Home
              </div>
            </div>
          </div>
          <button className="text-button" onClick={() => onSelect(settings.homeLocation!)}>
            View
          </button>
        </div>
      )}

      {recents.length === 0 ? (
        <div className="empty-state">
          <p>No searches yet. Use the search bar above to add a city.</p>
        </div>
      ) : (
        <ul className="location-list">
          {recents.map((loc) => (
            <li className="location-card" key={loc.id}>
              <button className="location-card-info location-card-info--button" onClick={() => onSelect(loc)}>
                <div>
                  <div className="location-card-name">{loc.name}</div>
                  <div className="location-card-meta">
                    {[loc.admin1, loc.country].filter(Boolean).join(", ")}
                  </div>
                </div>
              </button>
              <div className="location-card-actions">
                <button
                  className="icon-button"
                  title="Set as home"
                  onClick={() => setHomeLocation(loc)}
                >
                  <Home size={16} />
                </button>
                <button
                  className={`icon-button ${isFavorite(loc.id) ? "icon-button--active" : ""}`}
                  title={isFavorite(loc.id) ? "Remove favorite" : "Add favorite"}
                  onClick={() => (isFavorite(loc.id) ? removeFavorite(loc.id) : addFavorite(loc))}
                >
                  <Star size={16} fill={isFavorite(loc.id) ? "currentColor" : "none"} />
                </button>
                <button className="icon-button" title="Remove" onClick={() => onRemoveRecent(loc.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
