// src/components/StockSearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import { autocompleteStocks } from '../../services/searchService';
import { useNavigate } from 'react-router-dom';

const DEBOUNCE_MS = 300;

export default function StockSearchBar() {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const containerRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    setError('');
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await autocompleteStocks(keyword);
        setSuggestions(results);
        setShowDropdown(true);
      } catch (err) {
        setError('Search failed');
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [keyword]);

  // close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  const handleSelect = (symbol) => {
    setKeyword('');
    setSuggestions([]);
    setShowDropdown(false);
    navigate(`/stock/${encodeURIComponent(symbol)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0].symbol);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={containerRef}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          aria-label="Search stocks"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Search stocks by name or symbol..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => {
            if (suggestions.length) setShowDropdown(true);
          }}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((s) => (
            <div
              key={s.symbol}
              onClick={() => handleSelect(s.symbol)}
              className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div>
                <div className="font-medium">{s.symbol}</div>
                <div className="text-xs text-gray-500">{s.name}</div>
              </div>
              <div className="text-indigo-500">›</div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && !loading && suggestions.length === 0 && keyword.trim() && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow p-3 text-sm text-gray-600">
          No results for "{keyword}"
        </div>
      )}

      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}