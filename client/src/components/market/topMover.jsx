import { ArrowDownRight, ArrowUpRight, RefreshCw, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../config/api"

const REFRESH_INTERVAL_MS = 60_000

export default function TopMovers() {
  const [movers, setMovers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const fetchMovers = async () => {
    try {
      setError("")
      const response = await fetch(`${API_BASE_URL}/stocks/gainers?limit=5`)
      if (!response.ok) throw new Error("Unable to load movers")
      const data = await response.json()
      setMovers(Array.isArray(data) ? data : [])
    } catch (requestError) {
      console.error("Error fetching top movers:", requestError.message)
      setMovers([])
      setError("Live movers are temporarily unavailable.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovers()
    const interval = setInterval(fetchMovers, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="widget-state">Loading live movers...</div>

  return (
    <div className="top-movers">
      <div className="top-movers-heading">
        <div><p className="eyebrow"><TrendingUp size={14} /> Momentum</p><h2>Top movers</h2></div>
        <span className="panel-note">Updated every minute</span>
      </div>
      {movers.length === 0 ? (
        <div className="top-movers-empty">
          <p>{error || "No live movers available."}</p>
          <button type="button" onClick={fetchMovers} className="subtle-action"><RefreshCw size={14} /> Retry</button>
        </div>
      ) : (
        <div className="top-movers-list">
          {movers.map((stock) => {
            const change = Number(stock.change || 0)
            const isPositive = change >= 0
            return (
              <button key={stock.symbol} type="button" className="mover-row" onClick={() => navigate(`/stock/${encodeURIComponent(stock.symbol)}`)}>
                <span className="mover-identity"><strong>{stock.symbol}</strong><small>{stock.name || "Unknown company"}</small></span>
                <span className="mover-price">{Number.isFinite(Number(stock.price)) ? `$${Number(stock.price).toFixed(2)}` : "N/A"}</span>
                <span className={`mover-change ${isPositive ? "positive" : "negative"}`}>{isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{change.toFixed(2)}%</span>
                <span className="mover-cap"><small>Market cap</small><strong>{stock.marketCap ? `$${(Number(stock.marketCap) / 1e9).toFixed(1)}B` : "N/A"}</strong></span>
                <span className="mover-arrow" aria-hidden="true">→</span>
              </button>
            )
          })}
        </div>
      )}
      <div className="top-movers-refresh"><span className="live-dot" /> Live market data</div>
    </div>
  )
}
