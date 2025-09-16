import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StockChart = ({ history }) => {
  // Check if history data is available; if not, render a message instead of the chart.
  if (!history || history.length === 0) {
    return (
      <div className="flex justify-center items-center h-full p-4 text-gray-500">
        <h3 className="text-lg font-semibold">Historical data is not available.</h3>
      </div>
    );
  }

  // The data mapping logic is already correct.
  const chartData = history.map(({ date, close }) => ({
    date,
    close,
  }));

  return (
    <div className="mb-4 p-4 bg-transparent rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Performance (Last 30 days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          {/* X-Axis: Display only the month and day, e.g., '09-16'. */}
          <XAxis 
            dataKey="date" 
            tickFormatter={(str) => str.slice(0, 5)} 
            padding={{ left: 20, right: 20 }}
          />
          {/* Y-Axis: Automatically sets the domain based on data and formats the price. */}
          <YAxis 
            domain={['auto', 'auto']} 
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          {/* Tooltip: Formats the value as a price. */}
          <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Price']} />
          {/* Line: Uses a simple, clean line without dots. */}
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#d8ca59ff" 
            strokeWidth={2}
            dot={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;