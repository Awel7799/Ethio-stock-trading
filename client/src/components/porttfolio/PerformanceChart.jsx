"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const sampleData = {
  "1D": [
    { time: "10 AM", value: 100 },
    { time: "12 PM", value: 120 },
    { time: "2 PM", value: 110 },
    { time: "4 PM", value: 130 },
  ],
  "1W": [
    { time: "Mon", value: 100 },
    { time: "Tue", value: 140 },
    { time: "Wed", value: 130 },
    { time: "Thu", value: 160 },
    { time: "Fri", value: 150 },
  ],
  "1M": [
    { time: "Week 1", value: 110 },
    { time: "Week 2", value: 150 },
    { time: "Week 3", value: 130 },
    { time: "Week 4", value: 170 },
  ],
  "3M": [
    // Adjusted data to visually match the image's graph shape for Jan, Feb, Mar
    { time: "Jan", value: 10000 },
    { time: "Feb", value: 9500 },
    { time: "Mar", value: 11000 },
  ],
  "1Y": [
    { time: "Q1", value: 14000 },
    { time: "Q2", value: 15500 },
    { time: "Q3", value: 14800 },
    { time: "Q4", value: 16200 },
  ],
  ALL: [
    { time: "2021", value: 8000 },
    { time: "2022", value: 10000 },
    { time: "2023", value: 12000 },
    { time: "2024", value: 12345 },
  ],
}

const PerformanceChart = () => {
  const [range, setRange] = useState("3M") // Default to 3M to match the image
  const data = sampleData[range]

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-600">Performance</h2>
        <div className="flex gap-2 text-sm">
          {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((period) => (
            <button
              key={period}
              onClick={() => setRange(period)}
              className={`px-2 py-1 rounded focus:outline-none ${
                range === period
                  ? "bg-gray-200 text-gray-800 font-medium" // Subtle active state
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <XAxis dataKey="time" axisLine={false} tickLine={false} />
          <YAxis hide={true} domain={["dataMin", "dataMax"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8B5CF6" // Purple color from the image
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PerformanceChart
