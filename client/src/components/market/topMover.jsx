import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopMovers = () => {
  const [movers, setMovers] = useState([]);

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stocks/gainers?limit=5');
        setMovers(response.data);
      } catch (error) {
        console.error('Error fetching top movers:', error.message);
      }
    };

    fetchMovers();
    const interval = setInterval(fetchMovers, 60000); // every 60 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-transparent rounded-lg p-4 w-full mx-auto mt-26 ml-0">
      <h2 className="text-[40px] font-semibold mb-4">Top Movers</h2>
      <div className="flex flex-wrap gap-4">
        {movers.map((stock) => (
          <div
            key={stock.symbol}
            className="flex justify-between w-[300px] h-[150px] items-center p-4 shadow-md rounded-md hover:shadow transition"
          >
            <div>
              <h3 className="text-md font-bold">{stock.symbol}</h3>
              <p className="text-sm text-gray-500">{stock.name}</p>
              <p className="text-sm text-gray-400">Market Cap: {stock.marketCap}</p>
            </div>
            <div className="text-right">
              <p className="text-md font-semibold">${stock.price.toFixed(2)}</p>
              <p
                className={`text-sm font-medium ${
                  parseFloat(stock.change) >= 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {stock.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopMovers;