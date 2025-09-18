import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useAuth } from '../../context/AuthContext';  // Adjust path as needed

function PerformanceChart() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState('1M');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/performance/${user._id}/history`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const data = await response.json();
        setHistory(data);
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error('Performance chart error:', err);
        setError('Unable to load real data');
        // Don't set mock data - let user know data is unavailable
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?._id]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const profit = payload[0].payload.profit || 0;
      const isProfit = profit >= 0;
      
      return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-4 backdrop-blur-sm">
          <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-lg font-bold text-gray-900">
              ${value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {profit !== 0 && (
              <p className={`text-sm font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {isProfit ? '+' : ''}${profit.toFixed(2)} P/L
              </p>
            )}
          </div>
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
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="flex space-x-2">
              {['1W', '1M', '3M', '6M', '1Y'].map((period) => (
                <div key={period} className="h-8 bg-gray-200 rounded w-12"></div>
              ))}
            </div>
          </div>
          <div className="h-80 bg-gray-100 rounded-lg mb-6"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="text-center space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-24 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Required</h3>
        <p className="text-gray-600">Please log in to view your portfolio performance</p>
      </div>
    );
  }

  // Format data for chart
  const chartData = history.map(({ date, portfolioValue, totalInvested }) => {
    const profit = portfolioValue - Math.abs(totalInvested || 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      portfolioValue: Number(portfolioValue),
      profit: profit,
      fullDate: new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  });

  const currentValue = chartData.length > 0 ? chartData[chartData.length - 1].portfolioValue : 0;
  const initialValue = chartData.length > 0 ? chartData[0].portfolioValue : 0;
  const totalGain = currentValue - initialValue;
  const percentageGain = initialValue > 0 ? ((totalGain / initialValue) * 100) : 0;
  const isPositive = totalGain >= 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Portfolio Performance</h3>
                <p className="text-blue-200 text-sm">Real-time investment tracking</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold">
                ${currentValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center text-lg font-semibold ${
                isPositive ? 'text-green-300' : 'text-red-300'
              }`}>
                {isPositive ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                {isPositive ? '+' : ''}${totalGain?.toFixed(2)} ({percentageGain?.toFixed(2)}%)
              </div>
            </div>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex bg-white/10 backdrop-blur rounded-lg p-1">
            {['1W', '1M', '3M', '6M', '1Y'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  timeframe === period 
                    ? 'bg-white text-slate-900 shadow-lg' 
                    : 'text-white/80 hover:text-white hover:bg-white/20'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-400/30 rounded-lg p-3">
            <p className="text-red-200 text-sm">
              <strong>Connection Issue:</strong> {error}. Please check your backend connection.
            </p>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="p-6">
        {chartData.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">No Investment Data</h4>
            <p className="text-gray-600 mb-4">Start investing to see your portfolio performance over time</p>
            <div className="text-sm text-gray-500">
              Make your first investment to begin tracking your portfolio growth
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? "#3B82F6" : "#EF4444"} stopOpacity={0.4}/>
                    <stop offset="50%" stopColor={isPositive ? "#3B82F6" : "#EF4444"} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={isPositive ? "#3B82F6" : "#EF4444"} stopOpacity={0.05}/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                  tickMargin={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  tickMargin={10}
                />
                <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" opacity={0.5} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="portfolioValue" 
                  stroke={isPositive ? "#3B82F6" : "#EF4444"}
                  strokeWidth={3}
                  fill="url(#portfolioGradient)"
                  dot={false}
                  activeDot={{ 
                    r: 8, 
                    stroke: isPositive ? "#3B82F6" : "#EF4444", 
                    strokeWidth: 3, 
                    fill: "#fff",
                    filter: "url(#glow)"
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Enhanced Performance Stats */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-100">
            <div className="text-center bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-sm text-gray-500 font-medium">Current Value</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${currentValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm text-gray-500 font-medium">Total Return</span>
              </div>
              <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}${totalGain?.toFixed(2)}
              </p>
            </div>
            <div className="text-center bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <span className="text-sm text-gray-500 font-medium">Return %</span>
              </div>
              <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{percentageGain?.toFixed(2)}%
              </p>
            </div>
            <div className="text-center bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm text-gray-500 font-medium">Days Tracked</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {chartData.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PerformanceChart;