import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useAuth } from "../../context/AuthContext"
import { API_BASE_URL } from "../../config/api"

const getUserId = (user) => user?.id || user?._id || user?.userId

export default function PerformanceChart() {
  const { user } = useAuth()
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const userId = getUserId(user)
    if (!userId) return
    fetch(`${API_BASE_URL}/performance/${userId}/history`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load performance")
        return response.json()
      })
      .then((history) => setChartData(Array.isArray(history) ? history : []))
      .catch(() => setError("Performance history is temporarily unavailable."))
      .finally(() => setLoading(false))
  }, [user])

  const currentValue = chartData.at(-1)?.portfolioValue || 0
  const initialValue = chartData[0]?.portfolioValue || 0
  const totalGain = currentValue - initialValue
  const percentageGain = initialValue ? (totalGain / initialValue) * 100 : 0

  if (loading) return <div className="widget-state">Loading performance history...</div>
  if (error) return <div className="widget-state">{error}</div>
  if (!chartData.length) return <div className="widget-state">No performance history recorded yet.</div>

  return (
    <div className="performance-widget">
      <div className="performance-summary"><strong>${currentValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong><span className={totalGain >= 0 ? "positive-text" : "negative-text"}>{totalGain >= 0 ? "+" : ""}${totalGain.toFixed(2)} ({percentageGain.toFixed(2)}%)</span></div>
      <div className="performance-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs><linearGradient id="portfolioArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8bc96b" stopOpacity={.4} /><stop offset="100%" stopColor="#8bc96b" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Portfolio"]} />
            <Area type="monotone" dataKey="portfolioValue" stroke="#5d984c" strokeWidth={2} fill="url(#portfolioArea)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
