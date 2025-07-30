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

  const handleClick = (quantity) => {
    navigate(`/stock/${quantity}`);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full top-20 ml-5">
      <h2 className="text-md font-semibold mb-3">Your Holdings</h2>
      <div className="flex flex-col gap-4">
        {holdings.map((stock, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b pb-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={() => handleClick(stock.symbol)}
          >
            <div>
              <h3 className="text-sm font-bold">{stock.symbol}</h3>
              <p className="text-xs text-gray-500">{stock.quantity} shares</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">${stock.currentValue}</p>
              <p
                className={`text-xs ${stock.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {stock.gainLoss >= 0 ? '+' : ''}
                {stock.gainLoss} ({stock.percentage}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoldingsCard;
