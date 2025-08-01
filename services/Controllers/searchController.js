// controllers/searchController.js
const FMP_BASE = 'https://financialmodelingprep.com/api/v3';
const API_KEY = process.env.FMP_API_KEY;

const STOCK_FALLBACK_LIST = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
];

// Autocomplete handler
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

    const url = new URL(`${FMP_BASE}/search`);
    url.searchParams.set('query', q);
    url.searchParams.set('limit', '10');
    url.searchParams.set('apikey', API_KEY);

    const resp = await fetch(url.toString());
    let results = [];
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && data.length) {
        results = data.map((i) => ({ symbol: i.symbol, name: i.name }));
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

// Detail handler
exports.getStockDetail = async (req, res) => {
  try {
    const raw = (req.params.symbol || '').trim();
    if (!raw) return res.status(400).json({ error: 'symbol required' });
    const symbol = raw.toUpperCase();

    let normalized = null;
    if (API_KEY) {
      const url = new URL(`${FMP_BASE}/profile/${encodeURIComponent(symbol)}`);
      url.searchParams.set('apikey', API_KEY);
      const resp = await fetch(url.toString());
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data) && data[0]) {
          const item = data[0];
          normalized = {
            symbol: item.symbol,
            name: item.companyName,
            logo: item.image,
            description: item.description,
            price: item.price ?? null,
            changesPercentage: item.changesPercentage ?? null,
            marketState: item.exchangeShortName || '',
          };
        }
      }
    }

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
