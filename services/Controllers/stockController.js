const axios = require('axios');

// Fetch live top gainers
const getTopGainersLive = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const url = 'https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved';
    const params = {
      formatted: true,
      scrIds: 'day_gainers', // Yahoo's predefined top gainers list
      count: limit,
      start: 0,
    };

    const response = await axios.get(url, { params });
    const quotes = response.data?.finance?.result?.[0]?.quotes || [];

    const formatted = quotes.map(stock => ({
      symbol: stock.symbol,
      name: stock.shortName || stock.longName || 'N/A',
      price: stock.regularMarketPrice?.raw ?? 'N/A',
      changePercent: stock.regularMarketChangePercent?.fmt || 'N/A',
      change: stock.regularMarketChange?.fmt || 'N/A',
      marketCap: stock.marketCap?.fmt || 'N/A',
    }));

    res.json(formatted.slice(0, limit));
  } catch (error) {
    console.error('Error fetching live top gainers:', error.message);
    res.status(500).json({ message: 'Failed to fetch live top gainers' });
  }
};

module.exports = { getTopGainersLive };