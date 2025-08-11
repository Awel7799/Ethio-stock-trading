// components/StockPortfolioCard.jsx
import React, { useEffect, useState } from 'react';
import { fetchStockPortfolio } from '../../../services/portfolioService';
import { useAuth } from '../../../context/AuthContext';

export default function StockPortfolioCard({ symbol, currentPrice }) {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await fetchStockPortfolio(user._id, symbol, currentPrice);
        setPortfolio(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) {
      loadPortfolio();
    }
  }, [symbol, currentPrice, user]);

  if (loading) return <div>Loading portfolio...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!portfolio.holding) return <div>You don’t own any {symbol} yet.</div>;

  const { holding, transactions, profitLoss } = portfolio;
  const profitLossColor = profitLoss >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white shadow rounded-2xl p-5 space-y-4">
      <h3 className="text-lg font-semibold">Your {symbol} Holdings</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Quantity</div>
          <div className="font-medium">{holding.quantity}</div>
        </div>
        <div>
          <div className="text-gray-500">Average Price</div>
          <div className="font-medium">${holding.purchasePrice.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-500">Total Value</div>
          <div className="font-medium">
            ${(holding.quantity * currentPrice).toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Profit/Loss</div>
          <div className={`font-medium ${profitLossColor}`}>
            ${profitLoss.toFixed(2)}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold mt-4">Transaction History</h4>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Date</th>
              <th className="text-left">Type</th>
              <th className="text-left">Qty</th>
              <th className="text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id} className="border-b">
                <td>{new Date(tx.transactionDate).toLocaleDateString()}</td>
                <td>{tx.type}</td>
                <td>{tx.quantity}</td>
                <td>${tx.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
