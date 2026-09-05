const { getStockSnapshot } = require("../services/marketDataService")

const stockCache = new Map()
const CACHE_DURATION_MS = 60 * 1000
const SYMBOL_PATTERN = /^[A-Z0-9.-]{1,15}$/

const getStockDetails = async (req, res) => {
  const symbol = req.params.symbol?.trim().toUpperCase()

  if (!symbol || !SYMBOL_PATTERN.test(symbol)) {
    return res.status(400).json({
      success: false,
      message: "A valid stock symbol is required",
      code: "INVALID_SYMBOL",
    })
  }

  const cached = stockCache.get(symbol)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return res.json(cached.data)
  }

  try {
    const stockData = await getStockSnapshot(symbol)
    stockCache.set(symbol, { data: stockData, timestamp: Date.now() })
    return res.json(stockData)
  } catch (error) {
    const statusCode = error.code === "MARKET_DATA_NOT_FOUND" ? 404 : 503
    console.error(`Market data request failed for ${symbol}:`, error.message)

    return res.status(statusCode).json({
      success: false,
      message: "Market data is temporarily unavailable",
      code: error.code || "MARKET_DATA_UNAVAILABLE",
    })
  }
}

module.exports = { getStockDetails }
