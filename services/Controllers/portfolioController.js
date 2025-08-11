// Controllers/portfolioController.js
const Holding = require('../models/Holding');
const StockTransaction = require('../models/StockTransaction');
const { ObjectId } = require('mongodb');

function toNumber(value) {
  if (value && typeof value.toNumber === 'function') return value.toNumber();
  return Number(value);
}

exports.getPortfolio = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentPrices = req.query.currentPrices ? JSON.parse(req.query.currentPrices) : {};

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const holdings = await Holding.find({ userId: new ObjectId(userId) });
    const transactions = await StockTransaction.find({ userId: new ObjectId(userId) }).sort({ transactionDate: -1 });

    let totalInvested = 0;
    let currentPortfolioValue = 0;

    const holdingsWithCalc = holdings.map(h => {
      const avgCost = toNumber(h.purchasePrice);
      const quantity = h.quantity;
      const invested = avgCost * quantity;
      totalInvested += invested;

      // Get current price from query param, fallback to avg cost
      const currentPrice = currentPrices[h.stockSymbol] || avgCost;
      const currentValue = currentPrice * quantity;
      currentPortfolioValue += currentValue;

      return {
        stockSymbol: h.stockSymbol,
        quantity,
        avgCost,
        invested,
        currentPrice,
        currentValue,
        profitLoss: currentValue - invested,
      };
    });

    const profitLoss = currentPortfolioValue - totalInvested;

    // Simulate wallet balance for example
    const walletBalance = 10000; // You can fetch real wallet balance from user account if available

    res.json({
      walletBalance,
      totalInvested,
      currentPortfolioValue,
      profitLoss,
      holdings: holdingsWithCalc,
      transactions,
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
