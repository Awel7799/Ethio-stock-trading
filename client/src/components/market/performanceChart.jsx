import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function PerformanceChart({ userId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchHistory = async () => {
    try {
      const userId = 1; // Or dynamically get from auth context/state
      const response = await fetch(`http://localhost:3000/api/performance/${userId}/history`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchHistory();
}, []);

  if (loading) return <p>Loading performance history...</p>;
  if (history.length === 0) return <p>No performance data available.</p>;

  // Format data for Recharts
  const chartData = history.map(({ date, portfolioValue }) => ({
    date: new Date(date).toLocaleDateString(),
    portfolioValue: Number(portfolioValue),
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Portfolio Performance History</h3>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="portfolioValue" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PerformanceChart;
