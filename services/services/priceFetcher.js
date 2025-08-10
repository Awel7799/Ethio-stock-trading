// utils/priceFetcher.js
const axios = require('axios');

const cache = {}; // { SYMBOL: { price: Number, timestamp: ms } }
const TTL = 600 * 1000; // 15 seconds cache

async function getQuote(symbol) {
  const upper = symbol.toUpperCase();
  const now = Date.now();

  // Check cache
  if (cache[upper] && now - cache[upper].timestamp < TTL) {
    return cache[upper].price;
  }

  try {
    // Fetch from FMP
    const url = `https://financialmodelingprep.com/api/v3/quote/${upper}`;
    const resp = await axios.get(url, {
      params: { apikey: process.env.FMP_API_KEY },
    });

    if (!Array.isArray(resp.data) || resp.data.length === 0) {
      throw new Error(`No data for ${upper}`);
    }

    const price = resp.data[0].price;
    if (typeof price !== 'number') {
      throw new Error(`Invalid price for ${upper}`);
    }

    // Cache it
    cache[upper] = { price, timestamp: now };
    return price;
  } catch (err) {
    console.error(`[priceFetcher] Error fetching price for ${upper}:`, err.message);
    return null; // Let controller handle null
  }
}

async function getQuotes(symbols) {
  const uniqueSymbols = [...new Set(symbols.map(s => s.toUpperCase()))];
  const results = {};

  await Promise.all(
    uniqueSymbols.map(async sym => {
      results[sym] = await getQuote(sym);
    })
  );

  return results;
}

module.exports = { getQuote, getQuotes };