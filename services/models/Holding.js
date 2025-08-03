// models/holding.js
const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  stockSymbol: {
    type: String,
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  purchaseDate: {
    type: Date,
    required: true,
    default: Date.now
  }
});

// reuse existing model if already compiled (prevents OverwriteModelError)
module.exports = mongoose.models.Holding || mongoose.model('Holding', holdingSchema);
