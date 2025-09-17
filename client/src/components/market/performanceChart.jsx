import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';

function PerformanceChart({ userId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // ← This was missing!
  const [timeframe, setTimeframe] = useState('1M');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const userIdToUse = userId || 1; // Use prop or default to 1
        const response = await fetch(`http://localhost:3000/api/performance/${userIdToUse}/history`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setHistory(data);
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error('Performance chart error:', err);
        setError(err.message);
        // Add mock data for development
        const mockData = generateMockData();
        setHistory(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  // Generate mock data for development/fallback
  const generateMockData = () => {
    const data = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    let baseValue = 10000;
    for (let i = 0; i < 180; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Add some realistic fluctuation
      const change = (Math.random() - 0.5) * 200;
      baseValue += change;
      
      data.push({
        date: date.toISOString(),
        portfolioValue: Math.max(baseValue, 8000) // Minimum value
      });
    }
    return data;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-lg font-bold text-gray-900">
            ${value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="flex space-x-2">
              {['1W', '1M', '3M', '6M', '1Y'].map((period) => (
                <div key={period} className="h-8 bg-gray-200 rounded w-12"></div>
              ))}
            </div>
          </div>
          <div className="h-64 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Format data for chart
  const chartData = history.map(({ date, portfolioValue }) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    portfolioValue: Number(portfolioValue),
    fullDate: new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }));

  const currentValue = chartData.length > 0 ? chartData[chartData.length - 1].portfolioValue : 0;
  const initialValue = chartData.length > 0 ? chartData[0].portfolioValue : 0;
  const totalGain = currentValue - initialValue;
  const percentageGain = initialValue > 0 ? ((totalGain / initialValue) * 100) : 0;
  const isPositive = totalGain >= 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold mb-2">Portfolio Performance</h3>
            <div className="space-y-1">
              <div className="text-3xl font-bold">
                ${currentValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center text-lg font-semibold ${
                isPositive ? 'text-green-200' : 'text-red-200'
              }`}>
                {isPositive ? (
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                {isPositive ? '+' : ''}${totalGain?.toFixed(2)} ({percentageGain?.toFixed(2)}%)
              </div>
            </div>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex bg-white/20 rounded-lg p-1">
            {['1W', '1M', '3M', '6M', '1Y'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  timeframe === period 
                    ? 'bg-white text-gray-900 shadow' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> Using demo data. {error}
            </p>
          </div>
        )}

        {chartData.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-semibold mb-2">No performance data available</p>
            <p className="text-sm text-gray-500">Start investing to see your portfolio performance</p>
          </div>
        ) : (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="portfolioValue" 
                  stroke={isPositive ? "#10B981" : "#EF4444"}
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                  dot={{ fill: isPositive ? "#10B981" : "#EF4444", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: isPositive ? "#10B981" : "#EF4444", strokeWidth: 2, fill: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium">Total Value</p>
            <p className="text-xl font-bold text-gray-900">
              ${currentValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium">Total Return</p>
            <p className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}${totalGain?.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium">Return %</p>
            <p className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{percentageGain?.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceChart;