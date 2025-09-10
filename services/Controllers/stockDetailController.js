const axios = require('axios');
const API_KEY = process.env.token; // Finnhub API key

const getStockDetails = async (req, res) => {
  const { symbol } = req.params;
  const upper = symbol.toUpperCase();

  try {
    // 1️⃣ Fetch live quote (current price & change %)
    const quoteResp = await axios.get('https://finnhub.io/api/v1/quote', {
      params: { symbol: upper, token: API_KEY },
    });
    const quote = quoteResp.data;

    if (!quote || quote.c === undefined) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    // 2️⃣ Fetch company profile
    const profileResp = await axios.get('https://finnhub.io/api/v1/stock/profile2', {
      params: { symbol: upper, token: API_KEY },
    });
    const profile = profileResp.data || {};

    // 3️⃣ Fetch historical data (last 30 days)
    const now = Math.floor(Date.now() / 1000);
    const from = now - 30 * 24 * 60 * 60; // 30 days ago
    const historyResp = await axios.get('https://finnhub.io/api/v1/stock/candle', {
      params: { symbol: upper, resolution: 'D', from, to: now, token: API_KEY },
    });

    const { c: closes, t: timestamps, s: status } = historyResp.data;
    const history = status === 'ok'
      ? timestamps.map((ts, i) => ({
          date: new Date(ts * 1000).toLocaleDateString(),
          close: closes[i] != null ? Number(closes[i]) : 0,
        }))
      : [];

    // 4️⃣ Return combined data
    return res.json({
      name: profile.name || upper,
      logo: profile.logo || null,
      price: quote.c != null ? Number(quote.c) : 0,
      changesPercentage: quote.dp != null ? Number(quote.dp) : 0,
      description: profile.finnhubIndustry || 'No description available.',
      history,
      marketState: quote.t ? 'Open' : 'Closed',
    });

  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getStockDetails };
