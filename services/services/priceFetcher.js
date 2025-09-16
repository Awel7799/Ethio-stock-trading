// services/priceFetcher.js
const axios = require('axios');

const cache = {};
const TTL = 15 * 1000; // 15s
const API_KEY = process.env.token;

async function getQuote(symbol) {
  const upper = symbol.toUpperCase();
  const now = Date.now();

  // Return cached price if not expired
  if (cache[upper] && now - cache[upper].timestamp < TTL) {
    return cache[upper].price;
  }

  try {
    const resp = await axios.get('https://finnhub.io/api/v1/quote', {
      params: { symbol: upper, token: API_KEY },
    });
    const data = resp.data;

    if (!data || data.c === undefined || data.c === 0) {
      throw new Error(`No valid price for ${upper}`);
    }

    const price = parseFloat(data.c);
    if (isNaN(price)) throw new Error(`Invalid price for ${upper}`);

    // Update cache
    cache[upper] = { price, timestamp: now };
    return price;
  } catch (err) {
    console.error(`[priceFetcher] Error for ${upper}:`, err.message);
    // Fallback to previous cached price if available
    if (cache[upper]) {
      return cache[upper].price;
    }
    // Last resort: return 0
    return 0;
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