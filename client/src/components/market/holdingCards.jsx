// File: src/components/market/HoldingsCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const holdings = [
  { symbol: 'AAPL', quantity: 10, currentValue: 2000, gainLoss: +150, percentage: +8.1 },
  { symbol: 'TSLA', quantity: 5, currentValue: 1100, gainLoss: -100, percentage: -8.3 },
  { symbol: 'AMZN', quantity: 7, currentValue: 1700, gainLoss: +200, percentage: +13.3 },
];

const HoldingsCard = () => {
  const navigate = useNavigate();

  const handleClick = (symbol) => {
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl border border-yellow-200 p-6 w-full">
      <div className="bg-gradient-to-r from-yellow-100 to-white rounded-lg p-4 mb-4">
        <h2 className="text-lg font-bold text-black tracking-wide">Your Holdings</h2>
        <p className="text-sm text-gray-700 font-medium">Portfolio Overview</p>
      </div>
      
      <div className="space-y-3">
        {holdings.map((stock, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b border-yellow-100 pb-3 cursor-pointer hover:bg-gradient-to-r hover:from-yellow-50 hover:to-white p-3 rounded-lg transition-all duration-200"
            onClick={() => handleClick(stock.symbol)}
          >
            <div>
              <h3 className="text-base font-bold text-black">{stock.symbol}</h3>
              <p className="text-sm text-gray-600 font-medium">{stock.quantity} shares</p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-black">${stock.currentValue.toLocaleString()}</p>
              <p
                className={`text-sm font-semibold ${
                  stock.gainLoss >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}
              >
                {stock.gainLoss >= 0 ? '+' : ''}
                ${Math.abs(stock.gainLoss)} ({stock.percentage}%)
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-yellow-200">
        <button className="w-full bg-gradient-to-r from-black to-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:from-gray-800 hover:to-black transition-all duration-200">
          View All Holdings
        </button>
      </div>
    </div>
  );
};

export default HoldingsCard;