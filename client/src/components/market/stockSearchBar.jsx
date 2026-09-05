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
    <div className="relative shadow-amber-200 shadow-2xl w-[40vw] mx-auto" ref={containerRef}>
      <form onSubmit={handleSubmit} className="flex items-center overflow-hidden rounded-xl bg-white shadow-lg">
        <input
          type="text"
          aria-label="Search stocks"
          className="flex-1 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-0 border-0 outline-none"
          placeholder="  Search stocks by name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => {
            if (suggestions.length) setShowDropdown(true);
          }}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-br from-[#FFF176] to-[#FFD54F] w-[15vw] shadow-[0_6px_0_#FFA000] font-medium hover:bg-gray-800 transition-colors duration-200 "
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-30 mt-2 w-full bg-white border border-wheat-200 rounded-xl shadow-xl max-h-60 overflow-auto">
          {suggestions.map((s, index) => (
            <div
              key={s.symbol}
              onClick={() => handleSelect(s.symbol)}
              className={`flex justify-between items-center px-4 py-3 hover:bg-wheat-50 cursor-pointer transition-colors duration-150 ${
                index !== suggestions.length - 1 ? 'border-b border-wheat-100' : ''
              }`}
            >
              <div className="flex-1">
                <div className="font-semibold text-black">{s.symbol}</div>
                <div className="text-sm text-gray-600">{s.name}</div>
              </div>
              <div className="text-black font-bold text-lg">›</div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && !loading && suggestions.length === 0 && keyword.trim() && (
        <div className="absolute z-30 mt-2 w-full bg-white border border-wheat-200 rounded-xl shadow-xl p-4">
          <div className="text-sm text-gray-600 text-center">
            No results for "{keyword}"
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-600 text-sm font-medium">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}