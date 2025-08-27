const axios = require('axios');
const ALPHA_URL = 'https://www.alphavantage.co/query';
const API_KEY = process.env.ALPHA_VANTAGE_KEY;

const getStockDetails = async (req, res) => {
  const { symbol } = req.params;
  const upper = symbol.toUpperCase();

  try {
    // 1. Quote
    const quoteResp = await axios.get(ALPHA_URL, {
      params: { function: 'GLOBAL_QUOTE', symbol: upper, apikey: API_KEY },
    });
    const quote = quoteResp.data['Global Quote'];
    if (!quote || !quote['05. price']) return res.status(404).json({ error: 'Stock not found' });

    // 2. Company Overview
    const overviewResp = await axios.get(ALPHA_URL, {
      params: { function: 'OVERVIEW', symbol: upper, apikey: API_KEY },
    });
    const profile = overviewResp.data || {};

    // 3. Historical Data
    const historyResp = await axios.get(ALPHA_URL, {
      params: {
        function: 'TIME_SERIES_DAILY_ADJUSTED',
        symbol: upper,
        apikey: API_KEY,
        outputsize: 'compact',
      },
    });

    const timeSeries = historyResp.data['Time Series (Daily)'] || {};
    const history = Object.entries(timeSeries)
      .slice(0, 30) // last 30 days
      .map(([date, values]) => ({ date, close: parseFloat(values['4. close']) }))
      .reverse(); // oldest first for chart

    // Send data
    return res.json({
      name: profile.Name || upper,
      logo: null,
      price: parseFloat(quote['05. price']),
      changesPercentage: parseFloat(quote['10. change percent']) || 0,
      description: profile.Description || 'No description available.',
      history, // 👈 This fixes the chart
      marketState: 'Open',
    });
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getStockDetails };
