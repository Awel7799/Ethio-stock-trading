import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getHoldings } from "../../services/holdings"
import { useAuth } from "../../context/AuthContext"

const getUserId = (user) => user?.id || user?._id || user?.userId

export default function HoldingsCard() {
  const { user } = useAuth()
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const userId = getUserId(user)
    if (!userId) return
    getHoldings(userId)
      .then((response) => setHoldings(Array.isArray(response) ? response : response?.data || []))
      .catch(() => setError("Holdings are temporarily unavailable."))
      .finally(() => setLoading(false))
  }, [user])

  return (
    <section className="panel holdings-panel">
      <div className="panel-heading"><div><p className="eyebrow">Positions</p><h2>Your holdings</h2></div></div>
      {loading ? <div className="widget-state">Loading holdings...</div> : null}
      {!loading && error ? <div className="widget-state">{error}</div> : null}
      {!loading && !error && holdings.length === 0 ? <div className="widget-state">No holdings recorded yet.</div> : null}
      {!loading && !error && holdings.length > 0 ? (
        <div className="holdings-list">
          {holdings.map((holding) => {
            const symbol = holding.symbol || holding.stockSymbol
            const value = Number(holding.currentValue ?? holding.marketValue ?? 0)
            const gain = Number(holding.gainLoss ?? holding.unrealizedGainLoss ?? 0)
            return (
              <button type="button" key={holding._id || symbol} className="holding-row" onClick={() => navigate(`/stock/${encodeURIComponent(symbol)}`)}>
                <span><strong>{symbol}</strong><small>{holding.quantity || 0} shares</small></span>
                <span><strong>${value.toLocaleString()}</strong><small className={gain >= 0 ? "positive-text" : "negative-text"}>{gain >= 0 ? "+" : "-"}${Math.abs(gain).toFixed(2)}</small></span>
              </button>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
