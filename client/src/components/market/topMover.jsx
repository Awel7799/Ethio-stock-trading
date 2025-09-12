import React, { useEffect, useState } from "react";
import axios from "axios";

const TopMovers = () => {
  const [movers, setMovers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/stocks/gainers?limit=5"
        );
        console.log("API Response:", response.data); // Debug log
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
    const interval = setInterval(fetchMovers, 60000); // refresh every 60 sec
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading top movers...</p>;
  }

  return (
    <div className="bg-transparent rounded-lg p-4 w-full mx-auto mt-6">
      <h2 className="text-[32px] font-semibold mb-4 text-black">
        <span className="inline-block w-8 h-8 bg-green-500 rounded-full mr-3 relative">
          <span className="absolute inset-0 flex items-center justify-center text-white font-bold">↗</span>
        </span>
        Top Movers
      </h2>
      <div className="flex flex-wrap gap-4">
        {movers.length === 0 ? (
          <div className="w-full text-center py-8">
            <p className="text-gray-600 mb-2">No movers data available.</p>
            <p className="text-sm text-gray-500">Please check your connection or try again later.</p>
          </div>
        ) : (
          movers.map((stock) => (
            <div
              key={stock.symbol}
              className="flex justify-between w-[300px] h-[150px] items-center p-4 shadow-md rounded-md bg-white border border-yellow-200 hover:shadow-lg hover:bg-yellow-50 transition"
            >
              <div>
                <h3 className="text-lg font-bold text-black">{stock.symbol}</h3>
                <p className="text-sm text-gray-600">{stock.name || "N/A"}</p>
                <p className="text-sm text-gray-600">
                  Market Cap:{" "}
                  {stock.marketCap
                    ? `$${Number(stock.marketCap).toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-black">
                  {stock.price
                    ? `$${stock.price.toFixed(2)}`
                    : "Price Unavailable"}
                </p>
                <p
                  className={`text-sm font-medium ${
                    parseFloat(stock.change || 0) >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {stock.change ? `${stock.change.toFixed(2)}%` : "N/A"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopMovers;