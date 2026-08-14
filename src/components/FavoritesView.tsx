import { Star, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { removeFavorite } from "../features/appSlice";
import type { GeoLocation } from "../types";

interface Props {
  onSelect: (loc: GeoLocation) => void;
}

export function FavoritesView({ onSelect }: Props) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.app.favorites);

  return (
    <div className="view">
      <h1 className="view-title">Favorites</h1>
      <p className="view-subtitle">Your starred cities, one tap away.</p>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <Star size={22} />
          <p>No favorites yet. Star a city from its weather page to save it here.</p>
        </div>
      ) : (
        <ul className="location-list">
          {favorites.map((loc) => (
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
                  className="icon-button icon-button--active"
                  title="Remove favorite"
                  onClick={() => dispatch(removeFavorite(loc.id))}
                >
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