import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useLazySearchCitiesQuery } from "../services/geocodingApi";
import type { GeoLocation } from "../types";

interface Props {
  onSelect: (location: GeoLocation) => void;
}

export function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // useLazySearchCitiesQuery gives us a `trigger` function we call
  // manually (instead of firing automatically like useGetWeatherQuery),
  // plus isFetching/data/error — RTK Query manages all the request state
  // that we used to track by hand with useState.
  const [triggerSearch, { data: results = [], isFetching, error }] = useLazySearchCitiesQuery();

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    const timer = setTimeout(() => {
      triggerSearch(trimmed);
      setOpen(true);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, triggerSearch]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(loc: GeoLocation) {
    onSelect(loc);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="search-bar" ref={containerRef}>
      <Search size={16} className="search-bar-icon" />
      <input
        type="text"
        placeholder="Search city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
      />
      {isFetching && <Loader2 size={16} className="search-bar-spinner" />}
      {open && (results.length > 0 || error) && (
        <ul className="search-results">
          {error && <li className="search-results-empty">Couldn't reach the search service.</li>}
          {!error &&
            results.map((loc) => (
              <li key={loc.id}>
                <button onClick={() => handleSelect(loc)}>
                  <span className="search-result-name">{loc.name}</span>
                  <span className="search-result-meta">
                    {[loc.admin1, loc.country].filter(Boolean).join(", ")}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}