// backend/models/WalletTransaction.js
const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wallet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdraw'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: 'Amount must be greater than 0'
    }
  },
  bank_code: {
    type: String,
    required: true,
    enum: ['cbe', 'awash', 'dashen', 'nib', 'boa', 'wegagen', 'united', 'abyssinia']
  },
  bank_name: {
    type: String,
    required: true
  },
  account_number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Basic Ethiopian bank account number validation
        return /^[0-9]{13,16}$/.test(v);
      },
      message: 'Invalid account number format'
    }
  },
  ethswitch_transaction_id: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'processing'],
    default: 'pending'
  },
  initiated_at: {
    type: Date,
    default: Date.now
  },
  completed_at: {
    type: Date
  },
  failure_reason: {
    type: String
  },
  fees: {
    ethswitch_fee: { type: Number, default: 0 },
    bank_fee: { type: Number, default: 0 },
    our_fee: { type: Number, default: 0 },
    total_fee: { type: Number, default: 0 }
  },
  // Store EthSwitch response data
  metadata: {
    ethswitch_reference: String,
    ussd_code: String,
    mobile_redirect_url: String,
    web_redirect_url: String,
    session_id: String,
    response_code: String,
    response_message: String
  }
});

// Indexes for better query performance
walletTransactionSchema.index({ user_id: 1, initiated_at: -1 });
walletTransactionSchema.index({ ethswitch_transaction_id: 1 });
walletTransactionSchema.index({ status: 1 });

// Generate transaction reference
walletTransactionSchema.pre('save', function(next) {
  if (this.isNew && !this.ethswitch_transaction_id) {
    // Generate a unique transaction reference
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    this.ethswitch_transaction_id = `TXN_${timestamp}_${random}`.toUpperCase();
  }
  next();
});

// Update completed_at when status changes to completed
walletTransactionSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed') {
    this.completed_at = Date.now();
  }
  next();
});

// Static method to create new transaction
walletTransactionSchema.statics.createTransaction = async function(transactionData) {
  try {
    const transaction = new this(transactionData);
    return await transaction.save();
  } catch (error) {
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
};

// Update transaction status
walletTransactionSchema.methods.updateStatus = async function(status, metadata = {}) {
  try {
    this.status = status;
    
    if (metadata.failure_reason) {
      this.failure_reason = metadata.failure_reason;
    }
    
    // Merge metadata
    this.metadata = { ...this.metadata, ...metadata };
    
    if (status === 'completed') {
      this.completed_at = Date.now();
    }
    
    return await this.save();
  } catch (error) {
    throw new Error(`Failed to update transaction status: ${error.message}`);
  }
};

// Get formatted amount
walletTransactionSchema.methods.getFormattedAmount = function() {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2
  }).format(this.amount);
};

// Get transaction duration
walletTransactionSchema.methods.getDuration = function() {
  if (!this.completed_at) return null;
  
  const start = new Date(this.initiated_at);
  const end = new Date(this.completed_at);
  const diffMs = end - start;
  
  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);
  
  return `${minutes}m ${seconds}s`;
};

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);