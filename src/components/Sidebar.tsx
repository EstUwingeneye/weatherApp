import { Home, LogOut, MapPin, Settings, Star } from "lucide-react";
import { useAuth } from "../context/authContextCore";
import type { ViewKey } from "../types";

interface Props {
  active: ViewKey;
  onChange: (v: ViewKey) => void;
  onLogout: () => void;
}

const ITEMS: { key: ViewKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "locations", label: "Locations", icon: MapPin },
  { key: "favorites", label: "Favorites", icon: Star },
  { key: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ active, onChange, onLogout }: Props) {
  const { profile, currentUser } = useAuth();
  const displayName = profile?.name || currentUser?.displayName || "Weatherly User";
  const email = profile?.email || currentUser?.email || "";

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">●</span>
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
      <div className="sidebar-user">
        <div>
          <strong>{displayName}</strong>
          <span>{email}</span>
        </div>
        <button className="sidebar-logout" onClick={onLogout} type="button" title="Sign out">
          <LogOut size={17} />
        </button>
      </div>
    </nav>
  );
}
