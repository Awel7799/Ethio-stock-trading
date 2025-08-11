import React, { useEffect, useState } from 'react';
import HoldingList from '../comman/stockDetailPage/HoldingList';
import { fetchUserPortfolio } from '../../services/portfolioServices';
import { useAuth } from '../../context/AuthContext';

const Portfolio = ({ currentPrices }) => {
  const { user, loading: authLoading } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user._id) {
      setError('User not logged in');
      setPortfolio(null);
      return;
    }

    setError(null);
    setPortfolio(null);

    fetchUserPortfolio(user._id, currentPrices)
      .then(setPortfolio)
      .catch((err) => setError(err.message));
  }, [user, authLoading, currentPrices]);

  if (authLoading) return <div className="text-center py-20 text-gray-500">Checking authentication...</div>;
  if (error) return <div className="text-red-600 text-center py-20 font-semibold">{error}</div>;
  if (!portfolio) return <div className="text-center py-20 text-gray-500">Loading portfolio...</div>;

  const {
    walletBalance,
    totalInvested,
    currentPortfolioValue,
    profitLoss,
    holdings,
    transactions,
  } = portfolio;

  const formattedCurrency = (val) =>
    val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  function toNumber(value) {
    if (value && typeof value.toNumber === 'function') return value.toNumber();
    return Number(value);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Wallet & Balances Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <BalanceCard title="Wallet Balance" amount={walletBalance} icon="💰" />
          <BalanceCard title="Total Invested" amount={totalInvested} icon="📈" />
          <BalanceCard title="Current Portfolio Value" amount={currentPortfolioValue} icon="📊" />
          <BalanceCard 
            title="Profit / Loss" 
            amount={profitLoss} 
            icon={profitLoss >= 0 ? "📈" : "📉"} 
            isProfit={profitLoss >= 0} 
          />
        </div>

        {/* Holdings */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700 border-b-2 border-blue-300 pb-2">Holdings</h2>
          <HoldingList holdings={holdings} />
        </section>

        {/* Transactions */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700 border-b-2 border-blue-300 pb-2">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-blue-100 text-left text-sm font-semibold text-blue-800 uppercase tracking-wide">
                  <th className="px-6 py-3 border-b border-blue-200">Date</th>
                  <th className="px-6 py-3 border-b border-blue-200">Type</th>
                  <th className="px-6 py-3 border-b border-blue-200">Stock</th>
                  <th className="px-6 py-3 border-b border-blue-200">Quantity</th>
                  <th className="px-6 py-3 border-b border-blue-200">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr
                    key={i}
                    className="hover:bg-blue-50 transition-colors duration-150 border-b border-blue-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(t.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{t.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{t.stockSymbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{t.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">
                      {formattedCurrency(toNumber(t.price) * t.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

// Small reusable card component for balances
function BalanceCard({ title, amount, icon, isProfit }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center transition-transform hover:scale-105`}>
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${isProfit === undefined ? 'text-gray-900' : isProfit ? 'text-green-600' : 'text-red-600'}`}>
        {amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </p>
    </div>
  );
}

export default Portfolio;
