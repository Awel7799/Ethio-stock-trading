// models/Investment.js
const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  transactionDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Investment', investmentSchema);
