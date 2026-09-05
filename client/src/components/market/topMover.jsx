import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

const TopMovers = () => {
  const [movers, setMovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/stocks/gainers?limit=5`
        );
        console.log("API Response:", response.data);
        setMovers(response.data);
      } catch (error) {
        console.error("Error fetching top movers:", error.message);
        // Add mock data for testing when API fails
        const mockData = [
          { symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: 2.15, marketCap: 2800000000000 },
          { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: 5.67, marketCap: 790000000000 },
          { symbol: "GOOGL", name: "Alphabet Inc.", price: 139.69, change: 1.89, marketCap: 1750000000000 },
          { symbol: "MSFT", name: "Microsoft Corp.", price: 378.85, change: 0.95, marketCap: 2810000000000 },
          { symbol: "AMZN", name: "Amazon.com Inc.", price: 144.05, change: 3.21, marketCap: 1500000000000 }
        ];
        setMovers(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchMovers();
    const interval = setInterval(fetchMovers, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleStockClick = (symbol) => {
    navigate(`/stock/${symbol}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        <p className="ml-4 text-gray-600 font-medium">Loading top movers...</p>
      </div>
    );
  }

  return (
    <div className="bg-transparent rounded-lg p-6 w-full mx-auto">
      {/* Enhanced Header */}
      <div className="flex items-center mb-8">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <div className="ml-4">
          <h2 className="text-3xl font-bold text-gray-900">Top Movers</h2>
          <p className="text-gray-600 font-medium">Today's biggest gainers</p>
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {movers.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-semibold mb-2">No movers data available</p>
            <p className="text-sm text-gray-500">Please check your connection or try again later</p>
          </div>
        ) : (
          movers.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => handleStockClick(stock.symbol)}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:bg-gradient-to-br hover:from-yellow-50 hover:to-green-50"
            >
              {/* Stock Symbol & Name */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {stock.symbol}
                  </h3>
                  <div className="w-2 h-2 bg-green-400 rounded-full group-hover:animate-pulse"></div>
                </div>
                <p className="text-sm text-gray-600 font-medium truncate">
                  {stock.name || "N/A"}
                </p>
              </div>

              {/* Price Information */}
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stock.price ? `$${stock.price.toFixed(2)}` : "N/A"}
                  </p>
                </div>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  parseFloat(stock.change || 0) >= 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {parseFloat(stock.change || 0) >= 0 ? (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  {stock.change ? `${stock.change.toFixed(2)}%` : "0.00%"}
                </div>

                {/* Market Cap */}
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-medium">Market Cap</p>
                  <p className="text-sm text-gray-700 font-semibold">
                    {stock.marketCap
                      ? `$${(Number(stock.marketCap) / 1e9).toFixed(1)}B`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Hover Effect Indicator */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center text-sm text-green-600 font-semibold">
                  <span>View Details</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Refresh Indicator */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
          Auto-refreshes every 60 seconds
        </div>
      </div>
    </div>
  );
};

export default TopMovers;