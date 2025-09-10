// controllers/searchController.js
const API_KEY = process.env.token;

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

    if (!API_KEY) {
      const regex = new RegExp(q, 'i');
      const suggestions = STOCK_FALLBACK_LIST.filter(
        (s) => regex.test(s.symbol) || regex.test(s.name)
      ).slice(0, 10);
      return res.json({ results: suggestions });
    }

    const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${API_KEY}`;
    const resp = await fetch(url);
    let results = [];
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data.result) && data.result.length) {
        results = data.result.map((i) => ({
          symbol: i.symbol,
          name: i.description,
        }));
      }
    }

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
      const [quoteResp, profileResp] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`),
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`)
      ]);

      if (quoteResp.ok && profileResp.ok) {
        const q = await quoteResp.json();
        const p = await profileResp.json();

        if (q.c) {
          normalized = {
            symbol,
            name: p.name || symbol,
            logo: p.logo || '',
            description: p.finnhubIndustry || '',
            price: q.c,
            changesPercentage: q.dp || 0,
            marketState: '', // Finnhub doesn’t directly expose market open/closed
          };
        }
      }
    }

    if (!normalized) {
      const fallback = STOCK_FALLBACK_LIST.find((s) => s.symbol === symbol);
      if (fallback) {
        normalized = { ...fallback, logo: '', description: '', price: null, changesPercentage: null, marketState: '' };
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
