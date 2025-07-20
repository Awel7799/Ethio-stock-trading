// models/Wallet.js
const mongoose = require('mongoose');

// This defines what a WALLET looks like in your database
const WalletSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true // Each user can only have one wallet
  },
  walletId: { 
    type: String, 
    unique: true, 
    required: true // Unique wallet identifier
  },
  balance: {
    amount: { 
      type: Number, 
      default: 0, 
      min: 0 // Balance can't be negative
    },
    currency: { 
      type: String, 
      default: 'ETB' // Ethiopian Birr
    },
    lastUpdated: { 
      type: Date, 
      default: Date.now 
    }
  },
  status: { 
    type: String, 
    enum: ['active', 'suspended', 'closed'], // Only these values allowed
    default: 'active' 
  },
  linkedBankAccounts: [{
    bankName: String, // "CBE", "Dashen Bank", etc.
    accountNumber: String,
    accountHolderName: String,
    isVerified: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now }
  }],
  kycVerified: { 
    type: Boolean, 
    default: false // User must verify identity to use wallet
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// This defines what a TRANSACTION looks like in your database
const TransactionSchema = new mongoose.Schema({
  walletId: { 
    type: String, 
    required: true,
    index: true // Makes searching faster
  },
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  transactionId: { 
    type: String, 
    unique: true, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['deposit', 'withdrawal', 'stock_purchase', 'stock_sale'],
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0.01 // Minimum transaction amount
  },
  currency: { 
    type: String, 
    default: 'ETB' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending' 
  },
  
  // For deposits/withdrawals via EthSwitch
  ethswitchData: {
    referenceId: String, // EthSwitch transaction reference
    bankCode: String, // Which bank was used
    accountNumber: String,
    responseCode: String,
    responseMessage: String,
    processedAt: Date
  },
  
  // For stock trading transactions
  stockData: {
    symbol: String, // Stock symbol (e.g., "EBANK")
    companyName: String,
    quantity: Number,
    pricePerShare: Number,
    totalAmount: Number
  },
  
  fees: {
    ethswitchFee: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    totalFees: { type: Number, default: 0 }
  },
  
  description: String, // Human readable description
  
  // Balance after this transaction
  balanceAfter: Number,
  
  completedAt: Date,
  failureReason: String // If transaction fails, why?
  
}, {
  timestamps: true
});

// Create indexes for faster searches
TransactionSchema.index({ createdAt: -1 }); // Most recent first
TransactionSchema.index({ status: 1 }); // Search by status
TransactionSchema.index({ type: 1 }); // Search by transaction type

// Export the models so other files can use them
module.exports = {
  Wallet: mongoose.model('Wallet', WalletSchema),
  Transaction: mongoose.model('Transaction', TransactionSchema)
};