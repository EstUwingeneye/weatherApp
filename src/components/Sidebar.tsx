import { Home, MapPin, Star, Settings } from "lucide-react";
import type { ViewKey } from "../types";

interface Props {
  active: ViewKey;
  onChange: (v: ViewKey) => void;
}

const ITEMS: { key: ViewKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "locations", label: "Locations", icon: MapPin },
  { key: "favorites", label: "Favorites", icon: Star },
  { key: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ active, onChange }: Props) {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">◐</span>
        <span className="sidebar-brand-name">Weatherly</span>
      </div>
      <ul className="sidebar-list">
        {ITEMS.map(({ key, label, icon: Icon }) => (
          <li key={key}>
            <button
              className={`sidebar-item ${active === key ? "sidebar-item--active" : ""}`}
              onClick={() => onChange(key)}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
