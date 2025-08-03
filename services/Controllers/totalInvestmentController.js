// controllers/totalInvestmentController.js
const Holding = require('../models/Holding');
const { getQuotes } = require('../helpers/priceFetcher');
const mongoose = require('mongoose');

// Helper: compute gain/loss
function computeGainLoss(purchasePrice, currentPrice, quantity) {
  const invested = purchasePrice * quantity;
  const currentValue = currentPrice * quantity;
  const profitLoss = currentValue - invested;
  const percent = invested === 0 ? 0 : (profitLoss / invested) * 100;
  return {
    invested,
    currentValue,
    profitLoss,
    percent,
  };
}

// 1. Individual stock investment
const getIndividualInvestment = async (req, res) => {
  try {
    const { userId, symbol } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }

    const stockSymbol = symbol.toUpperCase();
    const holding = await Holding.findOne({ userId, stockSymbol });
    if (!holding) {
      return res.status(404).json({ message: `No holding found for symbol ${stockSymbol}` });
    }

    const prices = await getQuotes([stockSymbol]);
    const currentPrice = prices[stockSymbol];
    if (currentPrice === null || typeof currentPrice !== 'number') {
      return res.status(502).json({ message: `Failed to fetch current price for ${stockSymbol}` });
    }

    const { invested, currentValue, profitLoss, percent } = computeGainLoss(
      holding.purchasePrice,
      currentPrice,
      holding.quantity
    );

    res.json({
      symbol: stockSymbol,
      quantity: holding.quantity,
      purchasePrice: holding.purchasePrice,
      currentPrice,
      invested,
      currentValue,
      gainLoss: {
        dollar: profitLoss,
        percent,
      },
    });
  } catch (error) {
    console.error('Individual investment error:', error);
    res.status(500).json({ message: 'Failed to compute individual investment' });
  }
};

// 2. Total investment & aggregate gain/loss
const getTotalInvestment = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const holdings = await Holding.find({ userId });
    if (!holdings.length) {
      return res.json({
        totalInvested: 0,
        totalCurrentValue: 0,
        totalGainLoss: { dollar: 0, percent: 0 },
        breakdown: [],
      });
    }

    const symbols = holdings.map(h => h.stockSymbol);
    const prices = await getQuotes(symbols);

    let totalInvested = 0;
    let totalCurrentValue = 0;
    const breakdown = [];

    for (const h of holdings) {
      const sym = h.stockSymbol.toUpperCase();
      const currentPrice = prices[sym];
      const invested = h.purchasePrice * h.quantity;

      if (currentPrice === null || typeof currentPrice !== 'number') {
        breakdown.push({
          symbol: sym,
          quantity: h.quantity,
          purchasePrice: h.purchasePrice,
          currentPrice: null,
          invested,
          currentValue: null,
          gainLoss: null,
          error: 'Price fetch failed',
        });
        continue;
      }

      const { currentValue, profitLoss, percent } = computeGainLoss(
        h.purchasePrice,
        currentPrice,
        h.quantity
      );

      totalInvested += invested;
      totalCurrentValue += currentValue;

      breakdown.push({
        symbol: sym,
        quantity: h.quantity,
        purchasePrice: h.purchasePrice,
        currentPrice,
        invested,
        currentValue,
        gainLoss: {
          dollar: profitLoss,
          percent,
        },
      });
    }

    const totalProfitLoss = totalCurrentValue - totalInvested;
    const totalPercent = totalInvested === 0 ? 0 : (totalProfitLoss / totalInvested) * 100;

    res.json({
      totalInvested,
      totalCurrentValue,
      totalGainLoss: {
        dollar: totalProfitLoss,
        percent: totalPercent,
      },
      breakdown,
    });
  } catch (error) {
    console.error('Total investment error:', error);
    res.status(500).json({ message: 'Failed to compute total investment' });
  }
};

module.exports = { getIndividualInvestment, getTotalInvestment };
