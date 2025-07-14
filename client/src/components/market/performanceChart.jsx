// File: src/components/portfolio/PerformanceChart.jsx

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const sampleData = {
  '1D': [
    { time: '10 AM', value: 100 },
    { time: '12 PM', value: 120 },
    { time: '2 PM', value: 110 },
    { time: '4 PM', value: 130 },
  ],
  '1W': [
    { time: 'Mon', value: 100 },
    { time: 'Tue', value: 140 },
    { time: 'Wed', value: 130 },
    { time: 'Thu', value: 160 },
    { time: 'Fri', value: 150 },
  ],
  '1M': [
    { time: 'Week 1', value: 110 },
    { time: 'Week 2', value: 150 },
    { time: 'Week 3', value: 130 },
    { time: 'Week 4', value: 170 },
  ],
  '3M': [
    { time: 'May', value: 120 },
    { time: 'Jun', value: 160 },
    { time: 'Jul', value: 180 },
  ],
  '1Y': [
    { time: 'Q1', value: 140 },
    { time: 'Q2', value: 200 },
    { time: 'Q3', value: 180 },
    { time: 'Q4', value: 210 },
  ],
  'ALL': [
    { time: '2021', value: 100 },
    { time: '2022', value: 200 },
    { time: '2023', value: 300 },
    { time: '2024', value: 400 },
  ],
};

const PerformanceChart = () => {
  const [range, setRange] = useState('1D');
  const data = sampleData[range];

  return (
    <div className="bg-white rounded-lg p-4 shadow-md w-full max-w-3xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Performance</h2>
        <div className="flex gap-2 text-sm">
          {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(period => (
            <button
              key={period}
              onClick={() => setRange(period)}
              className={`px-2 py-1 rounded ${
                range === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
