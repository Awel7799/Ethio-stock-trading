// Controllers/stockPortfolioController.js
const Holding = require('../models/Holding');
const StockTransaction = require('../models/StockTransaction');
const { ObjectId } = require('mongodb');

function toNumber(value) {
  if (value && typeof value.toNumber === 'function') {
    return value.toNumber();
  }
  return Number(value);
}

exports.getStockPortfolioDetails = async (req, res) => {
  try {
    const { userId, stockSymbol } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const upperSymbol = stockSymbol.toUpperCase();

    // 1. Get holding info
    const holding = await Holding.findOne({
      userId: new ObjectId(userId),
      stockSymbol: upperSymbol,
    });

    // 2. Get transactions for this stock
    const transactions = await StockTransaction.find({
      userId: new ObjectId(userId),
      stockSymbol: upperSymbol,
    }).sort({ transactionDate: -1 });

    // 3. Calculate profit/loss if holding exists
    let profitLoss = null;
    if (holding) {
      const avgPrice = toNumber(holding.purchasePrice);
      const totalCost = avgPrice * holding.quantity;
      const currentValue = toNumber(req.query.currentPrice || 0) * holding.quantity;
      profitLoss = currentValue - totalCost;
    }

    res.json({
      holding: holding || null,
      transactions,
      profitLoss,
    });
  } catch (error) {
    console.error('Error fetching stock portfolio details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
