const BuySellPanel = ({ holding }) => (
  <div className="mb-4 p-4 bg-white rounded shadow">
    <h3 className="text-lg font-semibold">Your Holdings</h3>
    <p>Shares: {holding.shares}</p>
    <p>Average Price: ${holding.avgPrice}</p>
    <p>Gain/Loss: {holding.gainLoss}</p>
    <div className="mt-2 space-x-4">
      <button className="bg-green-600 text-white px-4 py-2 rounded">Buy</button>
      <button className="bg-red-600 text-white px-4 py-2 rounded">Sell</button>
    </div>
  </div>
);

export default BuySellPanel;
