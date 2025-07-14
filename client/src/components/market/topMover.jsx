// File: src/components/market/TopMovers.jsx

import React from 'react';

const movers = [
  {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    marketCap: '900B',
    price: 274.32,
    change: '+4.5%',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    marketCap: '2.4T',
    price: 197.65,
    change: '-1.3%',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com',
    marketCap: '1.5T',
    price: 134.21,
    change: '+2.1%',
  },
];

const TopMovers = () => {
  return (
    <div className="bg-transparent rounded-lg p-4  w-[60%] max-w-3xl mx-auto mt-26 ml-0">
      <h2 className="text-[40px] font-semibold mb-4">Top Movers</h2>
      <div className="flex flex-wrap  gap-4">
        {movers.map((stock) => (
          <div
            key={stock.symbol}
            className="flex justify-between items-center ml-0 p-4 shadow-md rounded-md hover:shadow transition"
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
                  stock.change.startsWith('+') ? 'text-green-600' : 'text-red-500'
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
