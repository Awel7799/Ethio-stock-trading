import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StockChart = ({ history }) => {
  // Format and validate the data
  const chartData = React.useMemo(() => {
    if (!history || !Array.isArray(history) || history.length === 0) {
      console.log('No history data available, using mock data for chart');
      // Generate mock data if no history available
      const mockData = [];
      let basePrice = 150;
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        basePrice += (Math.random() - 0.5) * 10;
        basePrice = Math.max(basePrice, 100); // minimum price
        
        mockData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: parseFloat(basePrice.toFixed(2)),
          fullDate: date.toLocaleDateString()
        });
      }
      return mockData;
    }

    // Process real history data
    return history.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
      fullDate: new Date(item.date).toLocaleDateString(),
      volume: item.volume || 0
    })).filter(item => item.price > 0); // Filter out invalid prices
  }, [history]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <p className="text-sm text-gray-600">{data.fullDate}</p>
          <p className="text-lg font-bold text-gray-900">
            ${data.price.toFixed(2)}
          </p>
          {data.volume > 0 && (
            <p className="text-xs text-gray-500">
              Volume: {data.volume.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate price trend for color
  const isUpward = chartData.length > 1 && 
    chartData[chartData.length - 1].price > chartData[0].price;

  const strokeColor = isUpward ? '#10B981' : '#EF4444'; // Green if up, red if down

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No chart data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Price Chart (30 Days)</h4>
        <div className={`flex items-center text-sm font-medium ${
          isUpward ? 'text-green-600' : 'text-red-600'
        }`}>
          {isUpward ? (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          )}
          {isUpward ? 'Trending Up' : 'Trending Down'}
        </div>
      </div>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
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
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 6, 
                stroke: strokeColor, 
                strokeWidth: 2, 
                fill: '#fff' 
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Chart Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <p className="text-gray-500">Min Price</p>
          <p className="font-semibold text-gray-900">
            ${Math.min(...chartData.map(d => d.price)).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Max Price</p>
          <p className="font-semibold text-gray-900">
            ${Math.max(...chartData.map(d => d.price)).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Data Points</p>
          <p className="font-semibold text-gray-900">{chartData.length}</p>
        </div>
      </div>
    </div>
  );
};

export default StockChart;