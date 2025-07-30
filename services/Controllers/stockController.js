// controllers/stockController.js
const axios = require('axios');

// Fetch Top Movers (Gainers)
const getTopMovers = async (req, res) => {
  try {
    const response = await axios.get(`https://financialmodelingprep.com/api/v3/stock_market/gainers`, {
      params: {
        apikey: process.env.FMP_API_KEY,
      },
    });

    const data = response.data.slice(0, 7); // top 5 movers (you can adjust)
    const formatted = data.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.changesPercentage,
      marketCap: stock.marketCap || 'N/A'
    }));

    res.json(formatted);

  } catch (error) {
    console.error('Error fetching top movers:', error.message);
    res.status(500).json({ message: 'Failed to fetch top movers' });
  }
};

module.exports = { getTopMovers };
