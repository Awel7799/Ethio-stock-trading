import { Activity, ArrowUpRight, BarChart3, Newspaper, Sparkles } from "lucide-react"
import { createElement } from "react"
import StockSearchBar from "../components/market/stockSearchBar"
import TotalInvestmentCard from "../components/market/totalBalance"
import PerformanceChart from "../components/market/performanceChart"
import TopMovers from "../components/market/topMover"
import NewsFeed from "../components/market/newsFeed"

const MetricCard = ({ label, value, change, icon }) => (
  <article className="metric-card">
    <div className="metric-card-top"><span>{label}</span>{createElement(icon, { size: 17 })}</div>
    <strong>{value}</strong>
    {change && <span className="metric-change"><ArrowUpRight size={14} /> {change}</span>}
  </article>
)

export default function Markets() {
  return (
    <div className="market-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow"><span className="live-dot" /> Live market workspace</p>
          <h1>Good morning, {"trader"}.</h1>
          <p className="page-subtitle">Track your positions, scan momentum, and make your next move.</p>
        </div>
        <StockSearchBar />
      </section>

      <section className="metric-grid" aria-label="Portfolio summary">
        <MetricCard label="Portfolio value" value={<TotalInvestmentCard />} icon={BarChart3} />
        <MetricCard label="Today's movement" value="Live" change="Connected" icon={Activity} />
        <MetricCard label="Market signal" value="Open" change="Real-time data" icon={Sparkles} />
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-heading"><div><p className="eyebrow">Performance</p><h2>Portfolio overview</h2></div><span className="panel-tag">30D</span></div>
          <PerformanceChart />
        </article>
        <article className="panel movers-panel">
          <div className="panel-heading"><div><p className="eyebrow">Momentum</p><h2>Top movers</h2></div><span className="panel-tag">Live</span></div>
          <TopMovers />
        </article>
      </section>

      <section className="panel news-panel">
        <div className="panel-heading"><div><p className="eyebrow"><Newspaper size={14} /> Intelligence</p><h2>Market headlines</h2></div><span className="panel-note">Curated for your watchlist</span></div>
        <NewsFeed />
      </section>
    </div>
  )
}
