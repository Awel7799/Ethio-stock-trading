import React, { useEffect, useState } from 'react';
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
    return <LoadingState message="Checking authentication..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!portfolio) {
    return <LoadingState message="Loading portfolio..." />;
  }

  const {
    walletBalance,
    totalInvested,
    currentPortfolioValue,
    profitLoss,
    holdings = [],
    transactions = [],
  } = portfolio;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Key Metrics */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Portfolio</h1>
            <p className="text-gray-600">Track your investments and monitor performance</p>
          </div>

          {/* Main Portfolio Value Display */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <p className="text-gray-600 text-lg mb-2">Total Portfolio Value</p>
              <p className="text-5xl font-bold text-gray-900 mb-4">
                {formatCurrency(currentPortfolioValue)}
              </p>
              <div className="flex items-center justify-center">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  profitLoss >= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className="mr-1">{profitLoss >= 0 ? '📈' : '📉'}</span>
                  {profitLoss >= 0 ? '+' : ''}{formatCurrency(profitLoss)} Total P&L
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center">
                <div className="text-3xl mr-4">💰</div>
                <div>
                  <p className="text-blue-900 font-bold text-2xl">{formatCurrency(walletBalance)}</p>
                  <p className="text-blue-700 text-sm">Available Cash</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center">
                <div className="text-3xl mr-4">📊</div>
                <div>
                  <p className="text-purple-900 font-bold text-2xl">{formatCurrency(totalInvested)}</p>
                  <p className="text-purple-700 text-sm">Total Invested</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Holdings Section - Main Content */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="px-8 py-6 border-b bg-gray-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Holdings</h2>
                    <p className="text-gray-600 mt-1">{holdings.length} active positions</p>
                  </div>
                  <div className="text-3xl">🏦</div>
                </div>
              </div>
              <div className="p-8">
                <HoldingsGrid holdings={holdings} />
              </div>
            </div>
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border sticky top-6">
              <div className="px-6 py-4 border-b bg-gray-50 rounded-t-2xl">
                <div className="flex items-center">
                  <div className="text-xl mr-2">⚡</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                    <p className="text-sm text-gray-600">Latest trades</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <RecentTransactions transactions={transactions.slice(0, 6)} />
              </div>
            </div>
          </div>
        </div>

        {/* Full Transaction History */}
        {transactions.length > 6 && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="px-8 py-6 border-b bg-gray-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
                    <p className="text-gray-600 mt-1">Complete record of all your trades</p>
                  </div>
                  <div className="text-3xl">📋</div>
                </div>
              </div>
              <div className="p-8">
                <TransactionsTimeline transactions={transactions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading State Component
function LoadingState({ message }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent mx-auto mb-6"></div>
        <p className="text-xl text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

// Error State Component
function ErrorState({ error }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    </div>
  );
}

// Holdings Grid Component
function HoldingsGrid({ holdings }) {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6 opacity-60">📈</div>
        <h3 className="text-2xl font-bold text-gray-600 mb-2">No Holdings Yet</h3>
        <p className="text-gray-500 text-lg">Start investing to see your positions here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {holdings.map((holding, index) => (
        <HoldingCard key={index} holding={holding} />
      ))}
    </div>
  );
}

// Individual Holding Card - Enhanced
function HoldingCard({ holding }) {
  const currentValue = holding.currentPrice * holding.quantity;
  const investedValue = holding.averagePrice * holding.quantity;
  const profitLoss = currentValue - investedValue;
  const profitLossPercentage = ((profitLoss / investedValue) * 100);
  const isProfit = profitLoss >= 0;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200">
      {/* Header with Stock Symbol and Performance Badge */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-bold text-2xl text-gray-900 mb-1">{holding.stockSymbol}</h3>
          <p className="text-gray-600 font-medium">{holding.quantity} shares owned</p>
        </div>
        <div className={`px-3 py-2 rounded-lg font-bold text-sm ${
          isProfit 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {isProfit ? '+' : ''}{profitLossPercentage.toFixed(1)}%
        </div>
      </div>

      {/* Price Information Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Current Price</p>
          <p className="text-lg font-bold text-blue-900">{formatCurrency(holding.currentPrice)}</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">Your Avg Cost</p>
          <p className="text-lg font-bold text-purple-900">{formatCurrency(holding.averagePrice)}</p>
        </div>
      </div>

      {/* Value Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">Position Value</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(currentValue)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">Unrealized P&L</p>
            <p className={`text-xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {isProfit ? '+' : ''}{formatCurrency(profitLoss)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Recent Transactions Sidebar - Enhanced
function RecentTransactions({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3 opacity-50">📊</div>
        <p className="text-gray-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                transaction.type === 'buy' 
                  ? 'bg-green-500' 
                  : transaction.type === 'sell' 
                    ? 'bg-red-500' 
                    : 'bg-blue-500'
              }`}>
                {transaction.type === 'buy' ? 'B' : transaction.type === 'sell' ? 'S' : 'D'}
              </div>
              <div>
                <p className="font-bold text-gray-900">{transaction.stockSymbol}</p>
                <p className="text-xs text-gray-500 font-medium">
                  {new Date(transaction.transactionDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">
                {formatCurrency(toNumber(transaction.price) * transaction.quantity)}
              </p>
              <p className="text-xs text-gray-500">{transaction.quantity} shares</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Full Transactions Timeline - Enhanced
function TransactionsTimeline({ transactions }) {
  return (
    <div className="space-y-6">
      {transactions.map((transaction, index) => (
        <div key={index} className="flex items-start space-x-6 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border hover:shadow-md transition-shadow">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs ${
            transaction.type === 'buy' 
              ? 'bg-green-500' 
              : transaction.type === 'sell' 
                ? 'bg-red-500' 
                : 'bg-blue-500'
          }`}>
            {transaction.type === 'buy' ? 'BUY' : transaction.type === 'sell' ? 'SELL' : 'DEP'}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xl text-gray-900 mb-1">{transaction.stockSymbol}</h4>
                <p className="text-gray-600">
                  <span className="font-semibold">{transaction.quantity}</span> shares @ <span className="font-semibold">{formatCurrency(toNumber(transaction.price))}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-2xl text-gray-900 mb-1">
                  {formatCurrency(toNumber(transaction.price) * transaction.quantity)}
                </p>
                <p className="text-sm text-gray-500 font-medium">
                  {new Date(transaction.transactionDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    weekday: 'short'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Utility Functions
function formatCurrency(value) {
  if (typeof value === 'number') {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  return '$0.00';
}

function toNumber(value) {
  if (value && typeof value.toNumber === 'function') return value.toNumber();
  return Number(value) || 0;
}

export default Portfolio;