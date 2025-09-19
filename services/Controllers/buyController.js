const mongoose = require("mongoose");
const { Double, ObjectId } = require("mongodb");
const Holding = require("../models/Holding");
const StockTransaction = require("../models/StockTransaction");
const Wallet = require("../models/Wallet"); // Import your wallet model

function toNumber(value) {
  if (value && typeof value.toNumber === "function") {
    return value.toNumber();
  }
  return Number(value);
}

function toObjectId(id) {
  try {
    if (id) return new ObjectId(id);
  } catch (e) {}
  return new ObjectId(); // fallback
}

exports.buyStock = async (req, res) => {
  try {
    // 1. Extract inputs
    const userId = toObjectId(req.body.userId);
    const stockSymbol = (req.body.stockSymbol || "").trim().toUpperCase();
    const quantity = Number(req.body.quantity);
    const purchasePriceNum = Number(req.body.purchasePrice);
    const purchaseDate = req.body.purchaseDate
      ? new Date(req.body.purchaseDate)
      : new Date();

    // 2. Validate inputs
    if (!stockSymbol) {
      return res.status(400).json({ error: "stockSymbol is required" });
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      return res.status(400).json({ error: "quantity must be >= 1" });
    }
    if (!Number.isFinite(purchasePriceNum) || purchasePriceNum <= 0) {
      return res
        .status(400)
        .json({ error: "purchasePrice must be a positive number" });
    }

    const purchasePriceDouble = new Double(purchasePriceNum);
    const totalCost = toNumber(purchasePriceDouble) * quantity;

    // 3. Find wallet & withdraw
    const wallet = await Wallet.findByUserId(userId);
    if (!wallet) {
      return res.status(400).json({ error: "Wallet not found for user" });
    }

    try {
      await wallet.withdraw(totalCost); // ✅ use built-in method
    } catch (withdrawErr) {
      return res.status(400).json({ error: withdrawErr.message });
    }

    // 4. Upsert holding
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
      holding.purchaseDate = purchaseDate;

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
      type: "buy",
      quantity,
      price: purchasePriceDouble,
      transactionDate: purchaseDate,
    });
    await transaction.save();

    // 6. Return response
    return res.json({
      message: "Buy executed successfully",
      holding,
      availableBalance: wallet.balance, // already updated in withdraw()
      transaction,
      walletSummary: wallet.getWalletSummary(),
    });
  } catch (err) {
    console.error("buyStock error:", err);

    if (err.errorResponse && err.errorResponse.code === 121) {
      const details = err.errInfo?.details;
      return res.status(400).json({
        error: "Document failed validation",
        validation: details,
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Mongoose validation error",
        validation: err.errors,
      });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};