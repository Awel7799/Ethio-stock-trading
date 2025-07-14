import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
const StockDetailPage = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [userHolding, setUserHolding] = useState(null);

  useEffect(() => {
    // Placeholder: simulate API call
    const fetchStockDetails = async () => {
      // Simulate fetching data for this stock
      const fakeData = {
        symbol,
        name: "Apple Inc.",
        price: 192.4,
        dividend: "0.5%",
        description: "Apple is a technology company...",
        performance: [100, 120, 110, 130, 150], // for chart
        news: [
          { title: "Apple launches new iPhone", description: "Big update in September..." },
        ],
      };
      setStockData(fakeData);

      // Simulate user's holding
      const fakeHolding = {
        shares: 10,
        avgPrice: 150,
        gainLoss: "+42%",
      };
      setUserHolding(fakeHolding);
    };

    fetchStockDetails();
  }, [symbol]);

  if (!stockData) return <div>Loading...</div>;

  return (
     <div className="p-4">
      <h1 className="text-2xl font-bold">Stock Detail Page</h1>
      <p className="mt-2 text-lg">Symbol: {symbol}</p>
      {/* Display chart, price, holdings info, news, etc. here */}
    </div>
  );
};

export default StockDetailPage;
