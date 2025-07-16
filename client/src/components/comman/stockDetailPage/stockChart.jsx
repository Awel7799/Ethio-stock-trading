import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StockChart = ({ performance }) => {
  const chartData = performance.map((price, index) => ({
    name: `Day ${index + 1}`,
    price,
  }));

  return (
    <div className="mb-4 p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#10B981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
