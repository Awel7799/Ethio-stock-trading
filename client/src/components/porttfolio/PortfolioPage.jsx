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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 border-l-4 border-red-500">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-yellow-600 rounded-full mx-auto mb-4 opacity-75"></div>
          </div>
          <p className="text-gray-700 text-lg font-medium">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  const {
    walletBalance,
    totalInvested,
    currentPortfolioValue,
    profitLoss,
    holdings = [],
    transactions = [],
  } = portfolio;

  const formattedCurrency = (val) =>
    typeof val === 'number'
      ? val.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      : '$0.00';

  function toNumber(value) {
    if (value && typeof value.toNumber === 'function') return value.toNumber();
    return Number(value) || 0;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-600 via-yellow-700 to-black">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Portfolio Dashboard
            </h1>
            <p className="text-yellow-100 text-lg max-w-2xl mx-auto">
              Track your investments, monitor performance, and stay informed about your financial journey
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-12">

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <BalanceCard 
            title="Wallet Balance" 
            amount={walletBalance} 
            icon="💰" 
            gradient="from-yellow-500 to-yellow-600"
          />
          <BalanceCard 
            title="Total Invested" 
            amount={totalInvested} 
            icon="📈" 
            gradient="from-gray-700 to-black"
          />
          <BalanceCard 
            title="Portfolio Value" 
            amount={currentPortfolioValue} 
            icon="📊" 
            gradient="from-yellow-600 to-yellow-700"
          />
          <BalanceCard
            title="Profit / Loss"
            amount={profitLoss}
            icon={profitLoss >= 0 ? "📈" : "📉"}
            isProfit={profitLoss >= 0}
            gradient={profitLoss >= 0 ? "from-green-500 to-green-600" : "from-red-500 to-red-600"}
          />
        </div>

        {/* Holdings Section */}
        <section className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-yellow-200">
          <div className="bg-gradient-to-r from-yellow-600 to-black px-8 py-6">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <span className="mr-3">📋</span>
              Current Holdings
            </h2>
            <p className="text-yellow-100 mt-2">Your active stock positions and performance</p>
          </div>
          <div className="p-8">
            <HoldingList holdings={holdings} />
          </div>
        </section>

        {/* Transactions Section */}
        <section className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-yellow-200">
          <div className="bg-gradient-to-r from-black to-yellow-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <span className="mr-3">🔄</span>
              Recent Transactions
            </h2>
            <p className="text-yellow-100 mt-2">Latest trading activity and portfolio changes</p>
          </div>
          <div className="p-8">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">📊</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Transactions Yet</h3>
                <p className="text-gray-500">Your transaction history will appear here</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {transactions.map((transaction, index) => (
                  <TransactionCard 
                    key={index} 
                    transaction={transaction} 
                    formattedCurrency={formattedCurrency}
                    toNumber={toNumber}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

// Enhanced BalanceCard component
function BalanceCard({ title, amount, icon, isProfit, gradient }) {
  const displayAmount =
    typeof amount === 'number'
      ? amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      : '$0.00';

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-200 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
      <div className={`bg-gradient-to-r ${gradient} p-6`}>
        <div className="text-center">
          <div className="text-5xl mb-3 filter drop-shadow-lg">{icon}</div>
          <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        </div>
      </div>
      <div className="p-6 bg-gradient-to-b from-white to-yellow-50">
        <p className={`text-3xl font-bold text-center ${
          isProfit === undefined 
            ? 'text-gray-900' 
            : isProfit 
              ? 'text-green-600' 
              : 'text-red-600'
        }`}>
          {displayAmount}
        </p>
      </div>
    </div>
  );
}

// New TransactionCard component to replace table
function TransactionCard({ transaction, formattedCurrency, toNumber }) {
  const isPositive = transaction.type === 'buy' || transaction.type === 'deposit';
  const totalAmount = formattedCurrency(toNumber(transaction.price) * transaction.quantity);
  
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-white rounded-xl border border-yellow-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-yellow-400">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        
        {/* Left section - Main Info */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
            isPositive ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'
          }`}>
            {isPositive ? '+' : '-'}
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-lg text-gray-900">{transaction.stockSymbol}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                transaction.type === 'buy' 
                  ? 'bg-green-100 text-green-800'
                  : transaction.type === 'sell'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {transaction.type}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {new Date(transaction.transactionDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Right section - Financial Info */}
        <div className="flex flex-col md:items-end space-y-1">
          <div className="flex items-center space-x-4">
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500 font-medium">Quantity</p>
              <p className="text-lg font-bold text-gray-900">{transaction.quantity}</p>
            </div>
            
            <div className="w-px h-8 bg-gray-300"></div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500 font-medium">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">{totalAmount}</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">
            @ {formattedCurrency(toNumber(transaction.price))} per share
          </p>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;