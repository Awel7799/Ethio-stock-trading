// controllers/sellController.js
const { Double, ObjectId } = require('mongodb');
const Holding = require('../models/Holding');
const StockTransaction = require('../models/StockTransaction');
const Wallet = require('../models/Wallet'); 

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

exports.sellStock = async (req, res) => {
  try {
    const userId = toObjectId(req.body.userId);
    const stockSymbol = (req.body.stockSymbol || '').trim().toUpperCase();
    const quantity = Number(req.body.quantity);
    const sellPriceNum = Number(req.body.sellPrice);
    const sellDate = req.body.sellDate ? new Date(req.body.sellDate) : new Date();

    // 🔹 Validate
    if (!stockSymbol) return res.status(400).json({ error: 'stockSymbol is required' });
    if (!Number.isFinite(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'quantity must be >= 1' });
    }
    if (!Number.isFinite(sellPriceNum) || sellPriceNum <= 0) {
      return res.status(400).json({ error: 'sellPrice must be positive' });
    }

    const sellPriceDouble = new Double(sellPriceNum);
    const totalValue = sellPriceNum * quantity;

    // 🔹 Find holding
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

    // 🔹 Profit/loss calculation
    const profitLoss =
      (sellPriceNum - toNumber(holding.purchasePrice)) * quantity;

    // 🔹 Update/remove holding
    if (holding.quantity === quantity) {
      await Holding.deleteOne({ _id: holding._id });
      holding = null;
    } else {
      holding.quantity -= quantity;
      await holding.save();
    }

    // 🔹 Update wallet (deposit sale proceeds)
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      // if user has no wallet, create one
      wallet = await Wallet.createWallet(userId, 0);
    }
    await wallet.deposit(totalValue);

    // 🔹 Save transaction
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

    res.json({
      message: 'Sell executed successfully',
      holding,
      walletBalance: wallet.balance,
      transaction,
      profitLoss,
    });
  } catch (err) {
    console.error('sellStock error:', err);

    if (err.message?.includes('Wallet')) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};