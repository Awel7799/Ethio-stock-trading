import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StockChart = ({ history }) => {
  // Map history to chart data: use date for x-axis, close price for y-axis
  const chartData = history.map(({ date, close }) => ({
    date,
    close,
  }));

  return (
    <div className="mb-4 p-4 bg-transparent rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Performance (Last 30 days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Line type="monotone" dataKey="close" stroke="#d8ca59ff" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
