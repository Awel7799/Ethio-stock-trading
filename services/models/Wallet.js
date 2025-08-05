// backend/models/Wallet.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One wallet per user
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'Balance cannot be negative'
    }
  },
  currency: {
    type: String,
    default: 'ETB',
    enum: ['ETB']
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'closed'],
    default: 'active'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at field before saving
walletSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Create wallet for new user
walletSchema.statics.createWallet = async function(userId) {
  try {
    const existingWallet = await this.findOne({ user_id: userId });
    if (existingWallet) {
      return existingWallet;
    }

    const wallet = new this({
      user_id: userId,
      balance: 0,
      status: 'active'
    });

    return await wallet.save();
  } catch (error) {
    throw new Error(`Failed to create wallet: ${error.message}`);
  }
};

// Update balance with transaction safety
walletSchema.methods.updateBalance = async function(amount, operation = 'add') {
  try {
    if (operation === 'add') {
      this.balance += Math.abs(amount);
    } else if (operation === 'subtract') {
      if (this.balance < Math.abs(amount)) {
        throw new Error('Insufficient balance');
      }
      this.balance -= Math.abs(amount);
    }
    
    this.updated_at = Date.now();
    return await this.save();
  } catch (error) {
    throw new Error(`Failed to update balance: ${error.message}`);
  }
};

// Format balance for display
walletSchema.methods.getFormattedBalance = function() {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2
  }).format(this.balance);
};

module.exports = mongoose.model('Wallet', walletSchema);