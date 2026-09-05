const axios = require("axios")

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1"
const REQUEST_TIMEOUT_MS = 10_000

const getToken = () => process.env.TOKEN || process.env.token

const request = async (path, params = {}) => {
  const token = getToken()
  if (!token) {
    const error = new Error("Finnhub API token is not configured")
    error.code = "MARKET_DATA_NOT_CONFIGURED"
    throw error
  }

  const response = await axios.get(`${FINNHUB_BASE_URL}/${path}`, {
    params: { ...params, token },
    timeout: REQUEST_TIMEOUT_MS,
  })

  return response.data
}

const getStockSnapshot = async (symbol) => {
  const end = Math.floor(Date.now() / 1000)
  const start = end - 30 * 24 * 60 * 60

  const [quote, profile, candles] = await Promise.all([
    request("quote", { symbol }),
    request("stock/profile2", { symbol }),
    request("stock/candle", { symbol, resolution: "D", from: start, to: end }),
  ])

  if (!quote || !Number.isFinite(quote.c) || quote.c <= 0) {
    const error = new Error(`No quote available for ${symbol}`)
    error.code = "MARKET_DATA_NOT_FOUND"
    throw error
  }

  const history = candles?.s === "ok" && Array.isArray(candles.t)
    ? candles.t.map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toISOString(),
        price: candles.c[index],
        volume: candles.v?.[index] || 0,
        high: candles.h?.[index] || null,
        low: candles.l?.[index] || null,
        open: candles.o?.[index] || null,
      }))
    : []

  return {
    symbol,
    name: profile?.name || symbol,
    price: quote.c,
    change: quote.d ?? 0,
    changesPercentage: quote.dp ?? 0,
    previousClose: quote.pc ?? null,
    dayHigh: quote.h ?? null,
    dayLow: quote.l ?? null,
    volume: history.at(-1)?.volume || 0,
    marketCap: profile?.marketCapitalization ? profile.marketCapitalization * 1_000_000 : null,
    peRatio: null,
    high52w: null,
    low52w: null,
    logo: profile?.logo || null,
    description: profile?.name ? `${profile.name} market data from Finnhub.` : null,
    marketState: isMarketOpen() ? "Open" : "Closed",
    history,
  }
}

const isMarketOpen = () => {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "America/New_York",
  }).format(new Date())
  const hour = Number(new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    timeZone: "America/New_York",
  }).format(new Date()))

  return !["Sat", "Sun"].includes(weekday) && hour >= 9 && hour < 16
}

module.exports = { getStockSnapshot }
