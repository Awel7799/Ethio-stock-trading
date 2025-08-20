// models/StockTransaction.js
const mongoose = require("mongoose");

const StockTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  stockSymbol: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ["buy", "sell"],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  transactionDate: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model("StockTransaction", StockTransactionSchema);
