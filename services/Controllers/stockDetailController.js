// controllers/stockDetailController.js
const axios = require('axios');
const API_KEY = process.env.token; // Finnhub API key

const getStockDetails = async (req, res) => {
  const { symbol } = req.params;
  const upper = symbol.toUpperCase();

  try {
    const [quotePromise, profilePromise, historyPromise] = await Promise.allSettled([
      axios.get('https://finnhub.io/api/v1/quote', { params: { symbol: upper, token: API_KEY } }),
      axios.get('https://finnhub.io/api/v1/stock/profile2', { params: { symbol: upper, token: API_KEY } }),
      axios.get('https://finnhub.io/api/v1/stock/candle', {
        params: { symbol: upper, resolution: 'D', from: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60, to: Math.floor(Date.now() / 1000), token: API_KEY },
      }),
    ]);

    // Handle Quote data (most reliable on free plan)
    const quote = quotePromise.status === 'fulfilled' ? quotePromise.value.data : {};
    if (!quote || quote.c === undefined || quote.c === 0) {
      return res.status(404).json({ error: 'Stock not found or price data not available.' });
    }

    // Handle Company Profile (may fail, so default to empty object)
    const profile = profilePromise.status === 'fulfilled' ? profilePromise.value.data || {} : {};

    // Handle Historical Data (most likely to fail, so default to empty array)
    const historyData = historyPromise.status === 'fulfilled' ? historyPromise.value.data : { s: 'no_data' };
    const history = historyData.s === 'ok' && Array.isArray(historyData.c)
      ? historyData.t.map((ts, i) => ({
          date: new Date(ts * 1000).toLocaleDateString(),
          close: historyData.c[i] != null ? Number(historyData.c[i]) : 0,
        }))
      : [];

    return res.json({
      name: profile.name || upper,
      logo: profile.logo || null,
      price: quote.c != null ? Number(quote.c) : 0,
      changesPercentage: quote.dp != null ? Number(quote.dp) : 0,
      description: profile.finnhubIndustry || 'No description available on free plan.',
      history,
      marketState: quote.t ? 'Open' : 'Closed',
    });
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    return res.status(500).json({ error: 'Internal server error or API issue.' });
  }
};

module.exports = { getStockDetails };