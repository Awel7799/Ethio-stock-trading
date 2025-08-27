// controllers/searchController.js
const API_KEY = process.env.ALPHA_VANTAGE_KEY;

const STOCK_FALLBACK_LIST = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
];

// =======================
// Autocomplete handler
// =======================
exports.autocompleteStocks = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.status(400).json({ error: 'q required' });

    // No API key? use fallback
    if (!API_KEY) {
      const regex = new RegExp(q, 'i');
      const suggestions = STOCK_FALLBACK_LIST.filter(
        (s) => regex.test(s.symbol) || regex.test(s.name)
      ).slice(0, 10);
      return res.json({ results: suggestions });
    }

    // Alpha Vantage SYMBOL_SEARCH
    const url = new URL('https://www.alphavantage.co/query');
    url.searchParams.set('function', 'SYMBOL_SEARCH');
    url.searchParams.set('keywords', q);
    url.searchParams.set('apikey', API_KEY);

    const resp = await fetch(url.toString());
    let results = [];
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data?.bestMatches) && data.bestMatches.length) {
        results = data.bestMatches.map((i) => ({
          symbol: i['1. symbol'],
          name: i['2. name'],
        }));
      }
    }

    // fallback if no matches
    if (!results.length) {
      const regex = new RegExp(q, 'i');
      results = STOCK_FALLBACK_LIST.filter(
        (s) => regex.test(s.symbol) || regex.test(s.name)
      ).slice(0, 10);
      return res.json({ results, fallback: true });
    }

    return res.json({ results: results.slice(0, 10) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
};

// =======================
// Detail handler
// =======================
exports.getStockDetail = async (req, res) => {
  try {
    const raw = (req.params.symbol || '').trim();
    if (!raw) return res.status(400).json({ error: 'symbol required' });
    const symbol = raw.toUpperCase();

    let normalized = null;

    if (API_KEY) {
      // Get live quote
      const quoteUrl = new URL('https://www.alphavantage.co/query');
      quoteUrl.searchParams.set('function', 'GLOBAL_QUOTE');
      quoteUrl.searchParams.set('symbol', symbol);
      quoteUrl.searchParams.set('apikey', API_KEY);

      const resp = await fetch(quoteUrl.toString());
      if (resp.ok) {
        const data = await resp.json();
        const q = data['Global Quote'];
        if (q) {
          normalized = {
            symbol: q['01. symbol'],
            name: symbol, // Alpha Vantage free tier doesn’t return company name
            logo: '', // not available from Alpha Vantage
            description: '', // not available from Alpha Vantage
            price: parseFloat(q['05. price']),
            changesPercentage: parseFloat(q['10. change percent']),
            marketState: '', // Alpha Vantage doesn’t provide market state
          };
        }
      }
    }

    // Fallback to static list
    if (!normalized) {
      const fallback = STOCK_FALLBACK_LIST.find((s) => s.symbol === symbol);
      if (fallback) {
        normalized = {
          symbol: fallback.symbol,
          name: fallback.name,
          logo: '',
          description: '',
          price: null,
          changesPercentage: null,
          marketState: '',
        };
      } else {
        return res.status(404).json({ error: 'not found' });
      }
    }

    return res.json({ stock: normalized });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal' });
  }
};
