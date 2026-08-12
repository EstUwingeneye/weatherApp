import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { searchCities } from "../lib/weatherApi";
import type { GeoLocation } from "../types";

interface Props {
  onSelect: (location: GeoLocation) => void;
}

export function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const timer = setTimeout(async () => {
      try {
        const found = await searchCities(trimmed);
        setResults(found);
        setOpen(true);
      } catch {
        setError("Couldn't reach the search service.");
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

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
    setResults([]);
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
      {loading && <Loader2 size={16} className="search-bar-spinner" />}
      {open && (results.length > 0 || error) && (
        <ul className="search-results">
          {error && <li className="search-results-empty">{error}</li>}
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
