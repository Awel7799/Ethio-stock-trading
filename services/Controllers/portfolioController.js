// Controllers/portfolioController.js
const Holding = require('../models/Holding');
const StockTransaction = require('../models/StockTransaction');
const Wallet = require('../models/Wallet');
const { ObjectId } = require('mongodb');

// Helper: compute gain/loss
function computeGainLoss(purchasePrice, currentPrice, quantity) {
  const invested = purchasePrice * quantity;
  const currentValue = currentPrice * quantity;
  const profitLoss = currentValue - invested;
  const percent = invested === 0 ? 0 : (profitLoss / invested) * 100;
  return { invested, currentValue, profitLoss, percent };
}

function toNumber(value) {
  if (value && typeof value.toNumber === 'function') return value.toNumber();
  return Number(value);
}

exports.getPortfolio = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentPrices = req.query.currentPrices
      ? JSON.parse(req.query.currentPrices)
      : {};

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    // fetch holdings and transactions
    const holdings = await Holding.find({ userId: new ObjectId(userId) });
    const transactions = await StockTransaction.find({
      userId: new ObjectId(userId),
    }).sort({ transactionDate: -1 });

    // fetch wallet balance
    let wallet = await Wallet.findByUserId(userId);
    if (!wallet) {
      wallet = await Wallet.createWallet(userId, 10000);
    }
    const walletBalance = toNumber(wallet.balance);

    let totalInvested = 0;
    let totalCurrentValue = 0;

    const holdingsWithCalc = holdings.map((h) => {
      const avgCost = toNumber(h.purchasePrice);
      const quantity = h.quantity;
      const currentPrice = currentPrices[h.stockSymbol] || avgCost;

      const { invested, currentValue, profitLoss, percent } =
        computeGainLoss(avgCost, currentPrice, quantity);

      totalInvested += invested;
      totalCurrentValue += currentValue;

      return {
        stockSymbol: h.stockSymbol,
        quantity,
        purchasePrice: avgCost,
        currentPrice,
        invested,
        currentValue,
        gainLoss: {
          dollar: profitLoss,
          percent,
        },
      };
    });

    const totalProfitLoss = totalCurrentValue - totalInvested;
    const totalPercent =
      totalInvested === 0 ? 0 : (totalProfitLoss / totalInvested) * 100;

    res.json({
      walletBalance,
      currency: wallet.currency,
      totalInvested,
      currentPortfolioValue: totalCurrentValue, // ✅ match frontend
      profitLoss: totalProfitLoss, // ✅ match frontend
      profitLossPercent: totalPercent,
      holdings: holdingsWithCalc,
      transactions,
    });
  } catch (error) {
    console.error('❌ Error fetching portfolio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
