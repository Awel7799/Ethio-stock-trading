import React, { useState, useEffect } from "react";
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

function PerformanceChart() {
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("1M");

  // Generate multiple mock datasets
  useEffect(() => {
    const datasets = [];
    const today = new Date();

    for (let series = 0; series < 3; series++) { // multiple mock datasets
      let value = 5000 + series * 1000; // offset each dataset
      const data = [];

      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const change = (Math.random() - 0.4) * 200; // random fluctuation
        value += change;

        data.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          portfolioValue: Math.max(1000, value),
          totalInvested: 4500 + series * 500,
          profit: value - (4500 + series * 500),
        });
      }
      datasets.push(...data);
    }

    setChartData(datasets);
  }, []);

  const currentValue = chartData.length ? chartData[chartData.length - 1].portfolioValue : 0;
  const initialValue = chartData.length ? chartData[0].portfolioValue : 0;
  const totalGain = currentValue - initialValue;
  const percentageGain = initialValue > 0 ? (totalGain / initialValue) * 100 : 0;
  const isPositive = totalGain >= 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const profit = payload[0].payload.profit || 0;
      const isProfit = profit >= 0;
      return (
        <div className="bg-white border border-amber-200 rounded-xl shadow-xl p-4">
          <p className="text-amber-800 text-sm font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-lg font-bold text-black">
              ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {profit !== 0 && (
              <p className={`text-sm font-semibold ${isProfit ? "text-green-600" : "text-red-600"}`}>
                {isProfit ? "+" : ""}${Math.abs(profit).toFixed(2)} P/L
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200 flex justify-center">
      <div className="w-4/3">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-100 via-wheat-100 to-amber-50 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-4xl font-bold mb-1 text-amber-900">
                ${currentValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center text-lg font-semibold ${isPositive ? "text-green-700" : "text-red-700"}`}>
                {isPositive ? "+" : ""}${totalGain.toFixed(2)} ({isPositive ? "+" : ""}{percentageGain.toFixed(2)}%)
              </div>
            </div>

            {/* Timeframe Selector */}
            <div className="flex bg-wheat-50 rounded-lg p-1 border border-wheat-200">
              {["1W", "1M", "3M", "6M", "1Y"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    timeframe === period ? "bg-amber-200 text-amber-900 shadow-lg" : "text-amber-700 hover:text-amber-900 hover:bg-amber-100"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="">
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FEF3C7" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#6EE7B7" stopOpacity={0.1} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#92400E", fontWeight: 500 }} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#92400E", fontWeight: 500 }} tickFormatter={(val) => `${val.toLocaleString()}`} tickMargin={10} />
                <CartesianGrid strokeDasharray="3 3" stroke="#F59E0B" opacity={0.4} />
                <Tooltip content={<CustomTooltip />} />

                {/* Portfolio Value */}
                <Area
                  type="monotone"
                  dataKey="portfolioValue"
                  stroke="#B45309"
                  strokeWidth={3}
                  fill="url(#portfolioGradient)"
                  dot={false}          // removed dots
                  activeDot={false}    // removed active dot
                  animationDuration={1500}
                />

                {/* Total Invested */}
                <Line
                  type="monotone"
                  dataKey="totalInvested"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={false}           // removed dots
                  strokeDasharray="5 5"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
         
        </div>
      </div>
    </div>
  );
}

export default PerformanceChart;