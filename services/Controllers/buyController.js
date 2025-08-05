const mongoose = require('mongoose');
const { Double } = require('mongodb');
const Holding = require('../models/Holding');

// Simulated wallet base balance per user
const BASE_WALLET_BALANCE = 10000;

// Persistent fallback dummy user ID (used when none provided or invalid)
const FALLBACK_USER_ID = new mongoose.Types.ObjectId();

/**
 * Safely convert various stored values to a plain JS number.
 * Handles mongodb Double instances and regular numbers.
 */
function toNumber(value) {
  if (value && typeof value.toNumber === 'function') {
    return value.toNumber();
  }
  return Number(value);
}

/**
 * Normalize incoming userId string to ObjectId, fallback if invalid/missing.
 */
function toObjectId(id) {
  try {
    if (id) return new mongoose.Types.ObjectId(id);
  } catch (e) {
    // ignore, will return fallback
  }
  return FALLBACK_USER_ID;
}

/**
 * Compute available balance: base minus invested amount
 */
async function getBalance(userId) {
  const holdings = await Holding.find({ userId });
  const invested = holdings.reduce((sum, h) => {
    const price = toNumber(h.purchasePrice);
    return sum + price * h.quantity;
  }, 0);
  return BASE_WALLET_BALANCE - invested;
}

exports.buyStock = async (req, res) => {
  try {
    // 1. Extract and normalize inputs
    const userId = toObjectId(req.body.userId);
    const rawSymbol = req.body.stockSymbol || '';
    const stockSymbol = rawSymbol.trim().toUpperCase();

    const rawQuantity = req.body.quantity;
    const quantity = Number(rawQuantity);

    const rawPrice = req.body.purchasePrice;
    const parsedPrice = Number(rawPrice);

    const purchaseDate = req.body.purchaseDate ? new Date(req.body.purchaseDate) : undefined;

    // 2. Validate inputs
    if (!stockSymbol) {
      return res.status(400).json({ error: 'stockSymbol is required' });
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'quantity must be a number >= 1' });
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: 'purchasePrice must be a positive number' });
    }

    // Wrap price as BSON Double to satisfy strict schema on Atlas
    const purchasePriceDouble = new Double(parsedPrice);

    // Total cost
    const totalCost = toNumber(purchasePriceDouble) * quantity;

    // 3. Check balance
    const availableBalance = await getBalance(userId);
    if (totalCost > availableBalance) {
      return res.status(400).json({
        error: 'Insufficient balance to execute buy',
        required: totalCost,
        availableBalance,
      });
    }

    // 4. Upsert holding (merge if exists)
    let holding = await Holding.findOne({ userId, stockSymbol });

    if (holding) {
      // Existing holding: recompute weighted average purchase price
      const existingPrice = toNumber(holding.purchasePrice);
      const existingQuantity = holding.quantity;
      const existingTotalCost = existingPrice * existingQuantity;

      const newQuantity = existingQuantity + quantity;
      const newTotalCost = existingTotalCost + totalCost;
      const newAvgPrice = newTotalCost / newQuantity;

      holding.purchasePrice = new Double(newAvgPrice);
      holding.quantity = newQuantity;

      if (purchaseDate) {
        holding.purchaseDate = purchaseDate; // optional overwrite
      }

      await holding.save();
    } else {
      // New holding
      const doc = {
        userId,
        stockSymbol,
        purchasePrice: new Double(toNumber(purchasePriceDouble)),
        quantity,
      };
      if (purchaseDate) doc.purchaseDate = purchaseDate;

      holding = new Holding(doc);
      await holding.save();
    }

    const updatedAvailable = availableBalance - totalCost;

    return res.json({
      message: 'Buy executed successfully',
      holding,
      availableBalance: updatedAvailable,
    });
  } catch (err) {
    console.error('buyStock error full object:', err);

    // Schema-level validation failure (MongoDB server-side)
    if (err.errorResponse && err.errorResponse.code === 121) {
      const details = err.errInfo?.details;
      console.error('Validation details:', JSON.stringify(details, null, 2));
      return res.status(400).json({
        error: 'Document failed validation',
        validation: details,
      });
    }

    // Mongoose validation error (client-side schema enforcement)
    if (err.name === 'ValidationError') {
      console.error('Mongoose validation error:', err.errors);
      return res.status(400).json({
        error: 'Mongoose validation error',
        validation: err.errors,
      });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};