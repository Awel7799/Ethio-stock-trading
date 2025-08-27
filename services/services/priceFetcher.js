// services/priceFetcher.js
const axios = require('axios');

const cache = {};
const TTL = 15 * 1000; // 15s

async function getQuote(symbol) {
  const upper = symbol.toUpperCase();
  const now = Date.now();

  if (cache[upper] && now - cache[upper].timestamp < TTL) {
    return cache[upper].price;
  }

  try {
    const resp = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: upper,
        apikey: process.env.ALPHA_VANTAGE_KEY,
      },
    });

    const quote = resp.data['Global Quote'];
    if (!quote || !quote['05. price']) throw new Error(`No data for ${upper}`);

    const price = parseFloat(quote['05. price']);
    if (isNaN(price)) throw new Error(`Invalid price for ${upper}`);

    cache[upper] = { price, timestamp: now };
    return price;
  } catch (err) {
    console.error(`[priceFetcher] Error for ${upper}:`, err.message);
    return null;
  }
}

async function getQuotes(symbols) {
  const uniqueSymbols = [...new Set(symbols.map((s) => s.toUpperCase()))];
  const results = {};
  await Promise.all(uniqueSymbols.map(async (sym) => {
    results[sym] = await getQuote(sym);
  }));
  return results;
}

module.exports = { getQuote, getQuotes };
