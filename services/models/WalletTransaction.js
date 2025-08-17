// models/WalletTransaction.js - Updated WalletTransaction Model
// Updated schema with new fields as specified in the document

const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
    // Existing fields
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0.01, 'Amount must be greater than 0']
    },
    type: {
        type: String,
        required: true,
        enum: ['deposit', 'withdraw'],
        index: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    
    // NEW FIELDS as specified in document
    ethswitch_transaction_id: {
        type: String,
        sparse: true, // Allows multiple null values but unique non-null values
        index: true
    },
    status: {
        type: String,
        required: true,
        enum: ['initiated', 'pending', 'completed', 'failed'],
        default: 'initiated',
        index: true
    },
    bank_name: {
        type: String,
        trim: true,
        maxlength: [100, 'Bank name cannot exceed 100 characters']
    },
    bank_account: {
        type: String,
        trim: true,
        maxlength: [20, 'Bank account cannot exceed 20 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [255, 'Description cannot exceed 255 characters'],
        default: function() {
            return this.type === 'deposit' ? 'Stock trading wallet deposit' : 'Stock trading wallet withdrawal';
        }
    }
}, {
    timestamps: false, // We handle timestamps manually with created_at and updated_at
    collection: 'wallet_transactions'
});

// Compound indexes for performance
walletTransactionSchema.index({ userId: 1, status: 1 });
walletTransactionSchema.index({ userId: 1, created_at: -1 });
walletTransactionSchema.index({ ethswitch_transaction_id: 1 }, { sparse: true });

// Pre-save middleware to update updated_at
walletTransactionSchema.pre('save', function(next) {
    this.updated_at = new Date();
    next();
});

// Pre-update middleware to update updated_at
walletTransactionSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
    this.set({ updated_at: new Date() });
    next();
});

// Instance method to check if transaction is pending
walletTransactionSchema.methods.isPending = function() {
    return ['initiated', 'pending'].includes(this.status);
};

// Instance method to check if transaction is completed
walletTransactionSchema.methods.isCompleted = function() {
    return this.status === 'completed';
};

// Instance method to check if transaction failed
walletTransactionSchema.methods.isFailed = function() {
    return this.status === 'failed';
};

// Instance method to get masked bank account
walletTransactionSchema.methods.getMaskedBankAccount = function() {
    if (!this.bank_account) return null;
    if (this.bank_account.length <= 4) return this.bank_account;
    return `***${this.bank_account.slice(-4)}`;
};

// Static method to find transactions by status
walletTransactionSchema.statics.findByStatus = function(status, userId = null) {
    const query = { status };
    if (userId) {
        query.userId = userId;
    }
    return this.find(query).sort({ created_at: -1 });
};

// Static method to find pending transactions for polling
walletTransactionSchema.statics.findPendingTransactions = function(userId = null) {
    const query = { 
        status: { $in: ['initiated', 'pending'] },
        ethswitch_transaction_id: { $ne: null }
    };
    if (userId) {
        query.userId = userId;
    }
    return this.find(query).sort({ created_at: -1 });
};

// Static method to find transaction by EthSwitch ID
walletTransactionSchema.statics.findByEthSwitchId = function(ethswitchTransactionId) {
    return this.findOne({ ethswitch_transaction_id: ethswitchTransactionId });
};

// Static method to get user transaction statistics
walletTransactionSchema.statics.getUserStats = function(userId) {
    return this.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalAmount: { $sum: '$amount' }
            }
        }
    ]);
};

// Static method to get user transaction history with pagination
walletTransactionSchema.statics.getUserTransactionHistory = function(userId, page = 1, limit = 20, status = null) {
    const skip = (page - 1) * limit;
    const query = { userId: userId };
    
    if (status) {
        if (Array.isArray(status)) {
            query.status = { $in: status };
        } else {
            query.status = status;
        }
    }
    
    return Promise.all([
        this.find(query)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        this.countDocuments(query)
    ]);
};

// Virtual for transaction age in minutes
walletTransactionSchema.virtual('ageInMinutes').get(function() {
    return Math.floor((Date.now() - this.created_at.getTime()) / (1000 * 60));
});

// Virtual for formatted amount
walletTransactionSchema.virtual('formattedAmount').get(function() {
    return `${this.amount.toFixed(2)} ETB`;
});

// Transform function for JSON output
walletTransactionSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        delete ret.__v;
        delete ret._id;
        ret.id = doc._id;
        return ret;
    }
});

const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);

module.exports = WalletTransaction;