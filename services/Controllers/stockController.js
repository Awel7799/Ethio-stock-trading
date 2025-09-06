// controllers/stockController.js
const axios = require('axios');

const getTopGainersLive = async (req, res) => {
  try {
    const token = process.env.TOKEN;
    const limit = parseInt(req.query.limit) || 5;

    // Example symbols – later you can replace with a dynamic list
    const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];

    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const quote = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`
        );
        const profile = await axios.get(
          `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${token}`
        );

        return {
          symbol,
          name: profile.data.name || symbol,
          marketCap: profile.data.marketCapitalization || "N/A",
          price: quote.data.c || 0,       // current price
          change: quote.data.dp || 0      // percent change
        };
      })
    );

    // Sort by % change desc (top gainers)
    const sorted = results.sort((a, b) => b.change - a.change);

    res.json(sorted.slice(0, limit));
  } catch (error) {
    console.error("Error fetching top gainers:", error.message);
    res.status(500).json({ error: "Failed to fetch top gainers" });
  }
};

module.exports = { getTopGainersLive };
