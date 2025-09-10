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
        setMovers(response.data);
      } catch (error) {
        console.error("Error fetching top movers:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovers();
    const interval = setInterval(fetchMovers, 60000); // refresh every 60 sec
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading top movers...</p>;
  }

  return (
    <div className="bg-transparent rounded-lg p-4 w-full mx-auto mt-6">
      <h2 className="text-[32px] font-semibold mb-4">📈 Top Movers</h2>
      <div className="flex flex-wrap gap-4">
        {movers.length === 0 ? (
          <p className="text-gray-500">No movers data available.</p>
        ) : (
          movers.map((stock) => (
            <div
              key={stock.symbol}
              className="flex justify-between w-[300px] h-[150px] items-center p-4 shadow-md rounded-md bg-white hover:shadow-lg transition"
            >
              <div>
                <h3 className="text-lg font-bold">{stock.symbol}</h3>
                <p className="text-sm text-gray-600">{stock.name || "N/A"}</p>
                <p className="text-sm text-gray-500">
                  Market Cap:{" "}
                  {stock.marketCap
                    ? `$${Number(stock.marketCap).toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
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
