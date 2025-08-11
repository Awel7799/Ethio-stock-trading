// controllers/sellController.js
const mongoose = require('mongoose');
const { Double, ObjectId } = require('mongodb');
const Holding = require('../models/Holding');
const StockTransaction = require('../models/StockTransaction');

const BASE_WALLET_BALANCE = 10000; // simulated wallet
const FALLBACK_USER_ID = new ObjectId();

function toNumber(value) {
  if (value && typeof value.toNumber === 'function') {
    return value.toNumber();
  }
  return Number(value);
}

function toObjectId(id) {
  try {
    if (id) return new ObjectId(id);
  } catch (e) {}
  return FALLBACK_USER_ID;
}

async function getBalance(userId) {
  const holdings = await Holding.find({ userId });
  const invested = holdings.reduce((sum, h) => {
    const price = toNumber(h.purchasePrice);
    return sum + price * h.quantity;
  }, 0);
  return BASE_WALLET_BALANCE - invested;
}

exports.sellStock = async (req, res) => {
  try {
    // 1. Extract inputs
    const userId = toObjectId(req.body.userId);
    const rawSymbol = req.body.stockSymbol || '';
    const stockSymbol = rawSymbol.trim().toUpperCase();

    const rawQuantity = req.body.quantity;
    const quantity = Number(rawQuantity);

    const rawPrice = req.body.sellPrice;
    const sellPriceNum = Number(rawPrice);

    const sellDate = req.body.purchaseDate ? new Date(req.body.purchaseDate) : new Date();

    // 2. Validate inputs
    if (!stockSymbol) {
      return res.status(400).json({ error: 'stockSymbol is required' });
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'quantity must be a number >= 1' });
    }
    if (!Number.isFinite(sellPriceNum) || sellPriceNum <= 0) {
      return res.status(400).json({ error: 'sellPrice must be a positive number' });
    }

    const sellPriceDouble = new Double(sellPriceNum);
    const totalValue = toNumber(sellPriceDouble) * quantity;

    // 3. Find holding
    let holding = await Holding.findOne({ userId, stockSymbol });
    if (!holding) {
      return res.status(400).json({ error: 'You do not own this stock' });
    }

    if (holding.quantity < quantity) {
      return res.status(400).json({
        error: 'Not enough quantity to sell',
        ownedQuantity: holding.quantity,
      });
    }

    // 4. Calculate profit/loss (optional)
    const profitLoss =
      (toNumber(sellPriceDouble) - toNumber(holding.purchasePrice)) * quantity;

    // 5. Update or remove holding
    if (holding.quantity === quantity) {
      // Selling all shares
      await Holding.deleteOne({ _id: holding._id });
      holding = null;
    } else {
      holding.quantity -= quantity;
      await holding.save();
    }

    // 6. Save transaction
    const transaction = new StockTransaction({
      userId,
      stockSymbol,
      type: 'sell',
      quantity,
      price: sellPriceDouble,
      transactionDate: sellDate,
      profitLoss,
    });
    await transaction.save();

    // 7. Get updated balance
    const availableBalance = await getBalance(userId);

    // 8. Response
    return res.json({
      message: 'Sell executed successfully',
      holding,
      availableBalance,
      transaction,
      profitLoss,
    });
  } catch (err) {
    console.error('sellStock error:', err);

    if (err.errorResponse && err.errorResponse.code === 121) {
      const details = err.errInfo?.details;
      return res.status(400).json({
        error: 'Document failed validation',
        validation: details,
      });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Mongoose validation error',
        validation: err.errors,
      });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};
