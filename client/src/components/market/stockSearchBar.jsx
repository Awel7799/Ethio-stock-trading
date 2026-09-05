import { LoaderCircle, Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { autocompleteStocks } from "../../services/searchService"

const DEBOUNCE_MS = 300

export default function StockSearchBar() {
  const [keyword, setKeyword] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const query = keyword.trim()
    if (!query) {
      setSuggestions([])
      setShowDropdown(false)
      return undefined
    }

    setError("")
    setLoading(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await autocompleteStocks(query)
        setSuggestions(results)
        setShowDropdown(true)
      } catch {
        setSuggestions([])
        setError("Search is temporarily unavailable")
        setShowDropdown(true)
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => clearTimeout(debounceRef.current)
  }, [keyword])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setShowDropdown(false)
    }
    window.addEventListener("mousedown", handleOutsideClick)
    return () => window.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  const selectSymbol = (symbol) => {
    setKeyword("")
    setSuggestions([])
    setShowDropdown(false)
    navigate(`/stock/${encodeURIComponent(symbol)}`)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const symbol = suggestions[0]?.symbol
    if (symbol) selectSymbol(symbol)
  }

  return (
    <div className="stock-search" ref={containerRef}>
      <form onSubmit={handleSubmit} className="stock-search-form">
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          aria-label="Search stocks"
          className="stock-search-input"
          placeholder="Search stocks by name or symbol"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        />
        <button type="submit" className="stock-search-button" disabled={loading || suggestions.length === 0}>
          {loading ? <LoaderCircle size={16} className="animate-spin" /> : "Search"}
        </button>
      </form>

      {showDropdown && (
        <div className="stock-search-dropdown">
          {error ? <p className="stock-search-message">{error}</p> : null}
          {!error && suggestions.length === 0 && !loading ? (
            <p className="stock-search-message">No results for “{keyword}”</p>
          ) : null}
          {suggestions.map((suggestion) => (
            <button key={suggestion.symbol} type="button" className="stock-search-result" onClick={() => selectSymbol(suggestion.symbol)}>
              <span><strong>{suggestion.symbol}</strong><small>{suggestion.name}</small></span>
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
