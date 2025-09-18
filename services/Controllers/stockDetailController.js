const axios = require('axios');

// In-memory cache to prevent API rate limiting
const stockCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getStockDetails = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Check cache first
    const cacheKey = symbol.toUpperCase();
    const cachedData = stockCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log(`📋 Returning cached data for ${symbol}`);
      return res.json(cachedData.data);
    }
    
    // Use Alpha Vantage key from your .env
    const alphaVantageKey = process.env.ALPHA_VANTAGE_KEY;
    
    console.log(`📊 Fetching stock details for symbol: ${symbol}`);
    console.log(`🔑 Alpha Vantage Key available: ${alphaVantageKey ? 'Yes' : 'No'}`);
    
    // Try Alpha Vantage with rate limiting protection
    if (alphaVantageKey) {
      try {
        console.log('🔍 Trying Alpha Vantage API...');
        
        const alphaResponse = await axios.get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${alphaVantageKey}`,
          { timeout: 15000 }
        );

        const data = alphaResponse.data['Global Quote'];
        
        if (data && Object.keys(data).length > 0) {
          const stockData = {
            symbol: symbol,
            name: symbol,
            price: parseFloat(data['05. price']) || 0,
            change: parseFloat(data['09. change']) || 0,
            changesPercentage: parseFloat(data['10. change percent']?.replace('%', '')) || 0,
            previousClose: parseFloat(data['08. previous close']) || 0,
            dayHigh: parseFloat(data['03. high']) || 0,
            dayLow: parseFloat(data['04. low']) || 0,
            volume: parseInt(data['06. volume']) || 0,
            marketCap: 0,
            peRatio: null,
            high52w: parseFloat(data['03. high']) || 0,
            low52w: parseFloat(data['04. low']) || 0,
            logo: null,
            description: `${symbol} stock information from Alpha Vantage.`,
            marketState: isMarketOpen() ? 'Open' : 'Closed',
            history: generateMockHistory(parseFloat(data['05. price']) || 150)
          };

          // Cache the successful response
          stockCache.set(cacheKey, {
            data: stockData,
            timestamp: Date.now()
          });

          console.log('✅ Alpha Vantage data processed and cached');
          return res.json(stockData);
        }
        
        throw new Error('No valid data from Alpha Vantage');
        
      } catch (alphaError) {
        console.log('❌ Alpha Vantage API failed:', alphaError.message);
        
        // Check if it's a rate limiting error
        if (alphaError.response && alphaError.response.status === 429) {
          console.log('⚠️ Rate limit exceeded, using mock data');
        }
      }
    }

    // Fallback to mock data with realistic values
    const mockPrice = Math.random() * 200 + 50;
    const mockData = {
      symbol: symbol,
      name: `${symbol} Inc.`,
      price: parseFloat(mockPrice.toFixed(2)),
      change: parseFloat(((Math.random() - 0.5) * 20).toFixed(2)),
      changesPercentage: parseFloat(((Math.random() - 0.5) * 10).toFixed(2)),
      previousClose: parseFloat((mockPrice - ((Math.random() - 0.5) * 20)).toFixed(2)),
      dayHigh: parseFloat((mockPrice + Math.random() * 15).toFixed(2)),
      dayLow: parseFloat((mockPrice - Math.random() * 15).toFixed(2)),
      volume: Math.floor(Math.random() * 10000000),
      marketCap: Math.floor(Math.random() * 1000000000000),
      peRatio: parseFloat((Math.random() * 30 + 10).toFixed(2)),
      high52w: parseFloat((mockPrice + Math.random() * 50).toFixed(2)),
      low52w: parseFloat((mockPrice - Math.random() * 30).toFixed(2)),
      logo: null,
      description: `Mock data for ${symbol}. API rate limit exceeded or no API key available.`,
      marketState: 'Open',
      history: generateMockHistory(mockPrice)
    };

    // Cache mock data too (shorter duration)
    stockCache.set(cacheKey, {
      data: mockData,
      timestamp: Date.now()
    });

    console.log('📤 Sending mock data due to API limitations');
    res.json(mockData);

  } catch (error) {
    console.error('❌ Error in getStockDetails:', error.message);
    
    // Final fallback
    const finalMockPrice = 150;
    const finalMockData = {
      symbol: req.params.symbol,
      name: `${req.params.symbol} Inc.`,
      price: finalMockPrice,
      change: 2.5,
      changesPercentage: 1.67,
      previousClose: 147.5,
      dayHigh: 152.8,
      dayLow: 146.2,
      volume: 5000000,
      marketCap: 500000000000,
      peRatio: 18.5,
      high52w: 180,
      low52w: 120,
      logo: null,
      description: `Error fallback data for ${req.params.symbol}. Error: ${error.message}`,
      marketState: 'Closed',
      history: generateMockHistory(finalMockPrice)
    };

    res.json(finalMockData);
  }
};

// Generate mock historical data with proper structure for charts
const generateMockHistory = (currentPrice = 150) => {
  const history = [];
  let basePrice = currentPrice * 0.9; // Start 10% lower than current
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add realistic price movement
    const volatility = currentPrice * 0.02; // 2% volatility
    const change = (Math.random() - 0.5) * volatility;
    basePrice += change;
    
    // Ensure price doesn't go too low
    basePrice = Math.max(basePrice, currentPrice * 0.7);
    
    // Gradually trend toward current price
    const targetAdjustment = (currentPrice - basePrice) * 0.1;
    basePrice += targetAdjustment;
    
    history.push({
      date: date.toISOString(),
      price: parseFloat(basePrice.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
      high: parseFloat((basePrice + Math.random() * volatility).toFixed(2)),
      low: parseFloat((basePrice - Math.random() * volatility).toFixed(2)),
      open: parseFloat((basePrice + (Math.random() - 0.5) * volatility * 0.5).toFixed(2))
    });
  }
  
  // Make sure the last price is close to current price
  if (history.length > 0) {
    history[history.length - 1].price = currentPrice;
  }
  
  return history;
};

// Helper function to determine if market is open
const isMarketOpen = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();
  
  // Simple check: Monday-Friday, 9AM-4PM EST
  return day >= 1 && day <= 5 && hour >= 9 && hour <= 16;
};

// Clean up old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of stockCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION * 2) {
      stockCache.delete(key);
    }
  }
}, CACHE_DURATION);

module.exports = { getStockDetails };