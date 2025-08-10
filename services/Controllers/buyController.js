// buyController.js
const mongoose = require('mongoose');
const { Double, ObjectId } = require('mongodb'); // import ObjectId from mongodb driver
const Holding = require('../models/Holding');
const StockTransaction = require('../models/StockTransaction'); // You need this model for transactions

const BASE_WALLET_BALANCE = 10000; // Simulated wallet balance fallback

const FALLBACK_USER_ID = new ObjectId(); // fallback user id if invalid

function toNumber(value) {
  if (value && typeof value.toNumber === 'function') {
    return value.toNumber();
  }
  return Number(value);
}

function toObjectId(id) {
  try {
    if (id) return new ObjectId(id); // use `new` here!
  } catch (e) {
    // fallback silently
  }
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

exports.buyStock = async (req, res) => {
  try {
    // 1. Extract inputs
    const userId = toObjectId(req.body.userId);
    const rawSymbol = req.body.stockSymbol || '';
    const stockSymbol = rawSymbol.trim().toUpperCase();

    const rawQuantity = req.body.quantity;
    const quantity = Number(rawQuantity);

    const rawPrice = req.body.purchasePrice;
    const purchasePriceNum = Number(rawPrice);

    const purchaseDate = req.body.purchaseDate ? new Date(req.body.purchaseDate) : new Date();

    // 2. Validate inputs
    if (!stockSymbol) {
      return res.status(400).json({ error: 'stockSymbol is required' });
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'quantity must be a number >= 1' });
    }
    if (!Number.isFinite(purchasePriceNum) || purchasePriceNum <= 0) {
      return res.status(400).json({ error: 'purchasePrice must be a positive number' });
    }

    const purchasePriceDouble = new Double(purchasePriceNum);
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
      const existingPrice = toNumber(holding.purchasePrice);
      const existingQuantity = holding.quantity;
      const existingTotalCost = existingPrice * existingQuantity;

      const newQuantity = existingQuantity + quantity;
      const newTotalCost = existingTotalCost + totalCost;
      const newAvgPrice = newTotalCost / newQuantity;

      holding.purchasePrice = new Double(newAvgPrice);
      holding.quantity = newQuantity;
      holding.purchaseDate = purchaseDate; // update purchase date

      await holding.save();
    } else {
      holding = new Holding({
        userId,
        stockSymbol,
        purchasePrice: purchasePriceDouble,
        quantity,
        purchaseDate,
      });
      await holding.save();
    }

    // 5. Add transaction record
    const transaction = new StockTransaction({
      userId,
      stockSymbol,
      type: 'buy',
      quantity,
      price: purchasePriceDouble,
      transactionDate: purchaseDate,
    });
    await transaction.save();

    // 6. Return response
    return res.json({
      message: 'Buy executed successfully',
      holding,
      availableBalance: availableBalance - totalCost,
      transaction,
    });
  } catch (err) {
    console.error('buyStock error:', err);

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
