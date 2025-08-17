// services/models/Wallet.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Each user has only one wallet
  },
  balance: {
    type: Number,
    default: 0,
    min: 0, // Balance cannot be negative
    get: v => Math.round(v * 100) / 100 // Round to 2 decimal places
  },
  currency: {
    type: String,
    default: 'ETB', // Ethiopian Birr
    enum: ['ETB', 'USD']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Enhanced security fields
  isFrozen: {
    type: Boolean,
    default: false
  },
  freezeReason: {
    type: String,
    default: null
  },
  // Daily limits for sandbox testing
  dailyDepositLimit: {
    type: Number,
    default: 50000, // 50,000 ETB daily limit
    min: 0
  },
  dailyWithdrawalLimit: {
    type: Number,
    default: 30000, // 30,000 ETB daily limit
    min: 0
  },
  // Track daily usage
  todayDeposits: {
    type: Number,
    default: 0
  },
  todayWithdrawals: {
    type: Number,
    default: 0
  },
  lastResetDate: {
    type: Date,
    default: Date.now
  },
  // For security and tracking
  lastTransactionAt: {
    type: Date,
    default: null
  },
  totalDeposited: {
    type: Number,
    default: 0,
    get: v => Math.round(v * 100) / 100
  },
  totalWithdrawn: {
    type: Number,
    default: 0,
    get: v => Math.round(v * 100) / 100
  },
  transactionCount: {
    type: Number,
    default: 0
  },
  // Flutterwave integration fields
  flutterwaveData: {
    customerId: String, // Flutterwave customer ID
    subaccountId: String, // If using subaccounts
    lastSyncAt: Date
  },
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { getters: true }, // Include getters in JSON output
  toObject: { getters: true }
});

// Indexes for faster queries
walletSchema.index({ userId: 1 });
walletSchema.index({ isActive: 1 });
walletSchema.index({ isFrozen: 1 });

// Middleware to update updatedAt and reset daily limits
walletSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Reset daily limits if it's a new day
  const today = new Date().toDateString();
  const lastReset = this.lastResetDate ? this.lastResetDate.toDateString() : null;
  
  if (today !== lastReset) {
    this.todayDeposits = 0;
    this.todayWithdrawals = 0;
    this.lastResetDate = new Date();
  }
  
  next();
});

// Instance methods
walletSchema.methods.deposit = function(amount) {
  const depositAmount = parseFloat(amount);
  
  if (this.isFrozen) {
    throw new Error('Wallet is frozen. Cannot perform transactions.');
  }
  
  // Check daily deposit limit
  if (this.todayDeposits + depositAmount > this.dailyDepositLimit) {
    throw new Error(`Daily deposit limit of ${this.dailyDepositLimit} ETB exceeded`);
  }
  
  this.balance += depositAmount;
  this.totalDeposited += depositAmount;
  this.todayDeposits += depositAmount;
  this.transactionCount += 1;
  this.lastTransactionAt = new Date();
  
  return this.save();
};

walletSchema.methods.withdraw = function(amount) {
  const withdrawAmount = parseFloat(amount);
  
  if (this.isFrozen) {
    throw new Error('Wallet is frozen. Cannot perform transactions.');
  }
  
  if (this.balance < withdrawAmount) {
    throw new Error('Insufficient balance');
  }
  
  // Check daily withdrawal limit
  if (this.todayWithdrawals + withdrawAmount > this.dailyWithdrawalLimit) {
    throw new Error(`Daily withdrawal limit of ${this.dailyWithdrawalLimit} ETB exceeded`);
  }
  
  this.balance -= withdrawAmount;
  this.totalWithdrawn += withdrawAmount;
  this.todayWithdrawals += withdrawAmount;
  this.transactionCount += 1;
  this.lastTransactionAt = new Date();
  
  return this.save();
};

walletSchema.methods.freeze = function(reason) {
  this.isFrozen = true;
  this.freezeReason = reason;
  return this.save();
};

walletSchema.methods.unfreeze = function() {
  this.isFrozen = false;
  this.freezeReason = null;
  return this.save();
};

walletSchema.methods.getFormattedBalance = function() {
  return `${this.balance.toFixed(2)} ${this.currency}`;
};

walletSchema.methods.getRemainingDailyLimits = function() {
  return {
    deposit: Math.max(0, this.dailyDepositLimit - this.todayDeposits),
    withdrawal: Math.max(0, this.dailyWithdrawalLimit - this.todayWithdrawals)
  };
};

walletSchema.methods.getWalletSummary = function() {
  return {
    balance: this.getFormattedBalance(),
    totalDeposited: `${this.totalDeposited.toFixed(2)} ${this.currency}`,
    totalWithdrawn: `${this.totalWithdrawn.toFixed(2)} ${this.currency}`,
    transactionCount: this.transactionCount,
    dailyLimits: this.getRemainingDailyLimits(),
    isActive: this.isActive,
    isFrozen: this.isFrozen,
    lastTransactionAt: this.lastTransactionAt
  };
};

// Static methods
walletSchema.statics.createWallet = function(userId, initialBalance = 0) {
  return this.create({
    userId,
    balance: initialBalance
  });
};

walletSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId, isActive: true });
};

walletSchema.statics.getActiveWallets = function() {
  return this.find({ isActive: true, isFrozen: false });
};

walletSchema.statics.getTotalSystemBalance = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, totalBalance: { $sum: '$balance' } } }
  ]);
};

module.exports = mongoose.model('WalletModel', walletSchema);