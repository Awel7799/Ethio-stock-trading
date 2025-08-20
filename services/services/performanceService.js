// services/performanceService.js
const { getQuote } = require('./priceFetcher'); // Your existing price fetcher
const PerformanceSnapshot = require('../models/PerformanceSnapshot'); // Adjust path if needed

/**
 * Calculate total portfolio value for a user's holdings.
 * @param {Array} holdings Array of holdings objects
 * @param {string} userId The user's ID (for logging)
 * @returns {number} total portfolio value
 */
async function calculatePortfolioValue(holdings, userId) {
  if (!Array.isArray(holdings) || holdings.length === 0) {
    console.log(`No holdings to calculate for user ${userId}.`);
    return 0;
  }

  let totalValue = 0;
  const priceCache = {}; // Cache prices within this calculation to reduce API calls

  for (const holding of holdings) {
    const symbol = holding.stockSymbol;
    const quantity = holding.quantity;

    if (!symbol || typeof quantity !== 'number' || quantity <= 0) {
      console.warn(`Skipping invalid holding for user ${userId}:`, holding);
      continue;
    }

    // Use cached price if available
    if (!(symbol in priceCache)) {
      const price = await getQuote(symbol);
      if (price === null) {
        console.warn(`Price not found for symbol ${symbol} for user ${userId}. Skipping holding.`);
        continue;
      }
      priceCache[symbol] = price;
    }

    totalValue += priceCache[symbol] * quantity;
  }

  return totalValue;
}

/**
 * Save daily portfolio snapshot for a user.
 * @param {string} userId
 * @param {Array} holdings Array of holdings
 */
async function saveDailySnapshot(userId, holdings) {
  const portfolioValue = await calculatePortfolioValue(holdings, userId);
  const snapshot = new PerformanceSnapshot({
    userId,
    date: new Date(),
    portfolioValue,
  });

  await snapshot.save();
  console.log(`Saved snapshot for user ${userId}: $${portfolioValue.toFixed(2)}`);
}

module.exports = {
  calculatePortfolioValue,
  saveDailySnapshot,
};
