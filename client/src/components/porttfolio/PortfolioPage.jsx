import React, { useEffect, useState } from "react";
import { fetchUserPortfolio } from "../../services/portfolioServices";
import { useAuth } from "../../context/AuthContext";
import HoldingsCard from "../market/holdingCards";

const Portfolio = ({ currentPrices }) => {
  const { user, loading: authLoading } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user._id) {
      setError("User not logged in");
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Elegant Header */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 shadow-xl border-b-2 border-amber-300 m-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-8 lg:mb-0 lg:w-1/2">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-amber-200">
                <p className="text-amber-800 text-xl font-medium leading-relaxed">
                  Track your investments and watch your wealth grow
                </p>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <p className="text-gray-600 text-sm">
                    Real-time portfolio monitoring
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-end">
              <div className="bg-white shadow-2xl rounded-2xl px-10 py-8 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300">
                <div className="text-center">
                  <p className="text-amber-700 font-semibold text-lg mb-2">
                    Total Portfolio Value
                  </p>
                  <p className="text-4xl font-bold text-black mb-4">
                    {formatCurrency(currentPortfolioValue)}
                  </p>
                  <div className="pt-4 border-t border-amber-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Portfolio Overview
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Portfolio Metrics - Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard
            title="Available Cash"
            value={formatCurrency(walletBalance)}
            icon="💰"
            gradient="from-emerald-100 to-teal-100"
            borderColor="border-emerald-200"
          />
          <MetricCard
            title="Total Invested"
            value={formatCurrency(totalInvested)}
            icon="📊"
            gradient="from-blue-100 to-indigo-100"
            borderColor="border-blue-200"
          />
          <MetricCard
            title="Profit/Loss"
            value={formatCurrency(profitLoss)}
            icon={profitLoss >= 0 ? "📈" : "📉"}
            gradient={
              profitLoss >= 0
                ? "from-green-100 to-emerald-100"
                : "from-red-100 to-rose-100"
            }
            borderColor={
              profitLoss >= 0 ? "border-green-200" : "border-red-200"
            }
            isProfit={profitLoss >= 0}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Holdings Section - Redesigned as Cards */}
          <div className="xl:col-span-3">
            <div className="bg-gradient-to-br from-white via-amber-50/30 to-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="px-10 py-10 shadow-lg bg-white/80 backdrop-blur-sm rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-gradient-to-r from-amber-200 to-amber-300 rounded-full p-1">
                        <div className="bg-white rounded-full p-2">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold text-black">
                        My Holdings
                      </h2>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p className="text-gray-700 text-sm font-medium">
                          Live Market Updates
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <p className="text-gray-600 text-sm">
                          Real-time Valuation
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl p-5 shadow-xl">
                    <div className="bg-white rounded-xl p-3 shadow-inner">
                      <span className="text-3xl">🏦</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-10 bg-gradient-to-b from-transparent to-amber-50/20">
                <HoldingsShowcase holdings={holdings} />
              </div>
            </div>
          </div>

          {/* Side Panel - Recent Activity */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-amber-100">
              <div className="px-6 py-5 border-b border-amber-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 rounded-full p-2">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-black">
                      Recent Activity
                    </h2>
                    <p className="text-amber-700 text-sm">
                      Latest transactions
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <RecentTransactions transactions={transactions.slice(0, 5)} />
              </div>
            </div>
          </div>
        </div>

        {/* Full Transactions History */}
        {transactions.length > 5 && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl border border-amber-100">
            <div className="px-8 py-6 border-b border-amber-100">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 rounded-full p-3">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-black">
                    Transaction History
                  </h2>
                  <p className="text-amber-700">
                    Complete record of all your trades
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <TransactionsTimeline transactions={transactions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Loading State
function LoadingState({ message }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-amber-200">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-300 border-t-black mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>
        <p className="text-xl text-amber-700 font-medium">{message}</p>
      </div>
    </div>
  );
}

// Enhanced Error State
function ErrorState({ error }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-4 text-center border border-red-200">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-2xl font-bold text-black mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-red-600 bg-red-50 rounded-2xl p-4 border border-red-200">
          {error}
        </p>
      </div>
    </div>
  );
}

// Enhanced Metric Card
function MetricCard({ title, value, icon, gradient, borderColor, isProfit }) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl border-2 ${borderColor} p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-bold text-black opacity-70 mb-2 uppercase tracking-wide">
            {title}
          </p>
          <p className={`text-2xl font-bold text-black`}>{value}</p>
        </div>
        <div className="bg-white rounded-full p-4 shadow-md">
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
      {isProfit !== undefined && (
        <div className="mt-4">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
              isProfit
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {isProfit ? "📈 Profit" : "📉 Loss"}
          </div>
        </div>
      )}
    </div>
  );
}

// Redesigned Holdings Showcase (No Table)
function HoldingsShowcase({ holdings }) {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-amber-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🏪</span>
        </div>
        <h3 className="text-xl font-bold text-black mb-3">No Holdings Yet</h3>
        <p className="text-amber-700 max-w-sm mx-auto">
          Start investing to see your stock positions here. Your portfolio is
          waiting for its first investment!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {holdings.map((holding, index) => (
        <StockHoldingCard key={index} holding={holding} />
      ))}
    </div>
  );
}

// Individual Stock Card - Completely Redesigned
function StockHoldingCard({ holding }) {
  const currentValue = holding.currentPrice * holding.quantity;
  const investedValue = holding.averagePrice * holding.quantity;
  const profitLoss = currentValue - investedValue;
  const profitLossPercentage = (profitLoss / investedValue) * 100;
  const isProfit = profitLoss >= 0;

  return (
    <div className="bg-gradient-to-br from-amber-25 to-white rounded-2xl border-2 border-amber-100 hover:border-amber-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
      {/* Header Section */}
      <div className="p-6 border-b border-amber-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-black rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {holding.stockSymbol.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-black group-hover:text-amber-700 transition-colors">
                {holding.stockSymbol}
              </h3>
              <p className="text-amber-600 font-medium">
                {holding.quantity} shares owned
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Information */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Current vs Average Price */}
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">
                Current Price
              </p>
              <p className="text-lg font-bold text-black">
                {formatCurrency(holding.currentPrice)}
              </p>
            </div>
            <div className="mx-4 border-l border-amber-200 h-8"></div>
           
          </div>

          {/* Value Summary */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-amber-700">
                Market Value
              </span>
              <span className="text-xl font-bold text-black">
                {formatCurrency(currentValue)}
              </span>
            </div>
            
          </div>

          {/* Investment Summary */}
          
        </div>
      </div>
    </div>
  );
}

// Enhanced Recent Transactions
function RecentTransactions({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-amber-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-amber-700">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
        <div
          key={index}
          className="bg-amber-25 rounded-xl p-4 border border-amber-100 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                  transaction.type === "buy"
                    ? "bg-green-500"
                    : transaction.type === "sell"
                      ? "bg-red-500"
                      : "bg-blue-500"
                }`}
              >
                {transaction.type === "buy"
                  ? "B"
                  : transaction.type === "sell"
                    ? "S"
                    : "D"}
              </div>
              <div>
                <p className="font-bold text-black">
                  {transaction.stockSymbol}
                </p>
                <p className="text-xs text-amber-600">
                  {new Date(transaction.transactionDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-black">
                {formatCurrency(
                  toNumber(transaction.price) * transaction.quantity
                )}
              </p>
              <p className="text-xs text-amber-600">
                {transaction.quantity} shares
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Enhanced Transaction Timeline
function TransactionsTimeline({ transactions }) {
  return (
    <div className="space-y-6">
      {transactions.map((transaction, index) => (
        <div
          key={index}
          className="flex items-start space-x-4 bg-amber-25 rounded-2xl p-6 border border-amber-100 hover:shadow-lg transition-all"
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
              transaction.type === "buy"
                ? "bg-green-500"
                : transaction.type === "sell"
                  ? "bg-red-500"
                  : "bg-blue-500"
            }`}
          >
            {transaction.type === "buy"
              ? "BUY"
              : transaction.type === "sell"
                ? "SELL"
                : "DEP"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xl font-bold text-black">
                {transaction.stockSymbol}
              </h4>
              <div className="text-right">
                <p className="text-2xl font-bold text-black">
                  {formatCurrency(
                    toNumber(transaction.price) * transaction.quantity
                  )}
                </p>
                <p className="text-amber-600 font-medium">
                  {new Date(transaction.transactionDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl px-4 py-2 border border-amber-100">
              <p className="text-amber-700 font-medium">
                {transaction.quantity} shares @{" "}
                {formatCurrency(toNumber(transaction.price))} per share
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Utility Functions
function formatCurrency(value) {
  if (typeof value === "number") {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
  return "$0.00";
}

function toNumber(value) {
  if (value && typeof value.toNumber === "function") return value.toNumber();
  return Number(value) || 0;
}

export default Portfolio;
