// commom/stockDetailPage/StockPortfolioCard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { fetchStockPortfolio } from "../../../services/portfolioService";

export default function StockPortfolioCard({ symbol, currentPrice }) {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await fetchStockPortfolio(user._id, symbol, currentPrice);
        setPortfolio(data || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) loadPortfolio();
  }, [symbol, currentPrice, user]);

  if (loading) return <div>Loading portfolio...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!portfolio || !portfolio.holding)
    return <div>You don’t own any {symbol} yet.</div>;

  const { holding, transactions = [], profitLoss = 0 } = portfolio;
  const profitLossColor = profitLoss >= 0 ? "text-green-600" : "text-red-600";
  const qty = holding?.quantity || 0;
  const avgPrice = holding?.purchasePrice || 0;
  const totalValue = qty * (currentPrice || 0);

  return (
    <div className="bg-gradient-to-br from-wheat-100 to-amber-50 shadow-lg rounded-2xl p-4 space-y-4 border border-yellow-200">
      {/* Header */}
      <h3 className="text-lg font-bold text-yellow-800">
        Your {symbol} Holdings
      </h3>

      {/* Holdings Overview */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-2 rounded-lg shadow-sm">
          <div className="text-yellow-700 text-xs">Quantity</div>
          <div className="font-semibold text-yellow-900">{qty}</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-2 rounded-lg shadow-sm">
          <div className="text-yellow-700 text-xs">Average Price</div>
          <div className="font-semibold text-yellow-900">
            ${avgPrice.toFixed(2)}
          </div>
        </div>
        <div className="bg-gradient-to-l from-yellow-50 to bg-yellow-100 p-2 rounded-lg shadow-sm">
          <div className="text-yellow-700 text-xs">Total Value</div>
          <div className="font-semibold text-yellow-900">
            ${totalValue.toFixed(2)}
          </div>
        </div>
        <div className="bg-gradient-to-l from-yellow-50 to bg-yellow-100  p-2 rounded-lg shadow-sm">
          <div className="text-yellow-700 text-xs">Profit / Loss</div>
          <div className={`font-semibold ${profitLossColor}`}>
            ${profitLoss.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h4 className="text-md font-semibold text-yellow-800 mt-2">
          Transaction History
        </h4>
        <div className="mt-3 space-y-2">
          {(transactions || []).map((tx) => (
            <div
              key={tx._id}
              className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm"
            >
              <div>
                <p className="text-yellow-900 font-medium">{tx.type}</p>
                <p className="text-yellow-700 text-xs">
                  {new Date(tx.transactionDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-4 mt-2 sm:mt-0">
                <span className="text-yellow-800">Qty: {tx.quantity}</span>
                <span className="text-yellow-900 font-semibold">
                  ${tx.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
