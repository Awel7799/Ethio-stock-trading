// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config(); // Load secrets from .env file

// Import our database models
const { Wallet, Transaction } = require('./models/Wallet');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware (things that run on every request)
app.use(helmet()); // Security headers
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas successfully!');
})
.catch((error) => {
  console.error('❌ MongoDB connection failed:', error);
  process.exit(1);
});

// ========== WALLET API ENDPOINTS ==========

// 1. CREATE WALLET - When a new user signs up
app.post('/api/wallet/create', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }
    
    // Check if wallet already exists
    const existingWallet = await Wallet.findOne({ userId });
    if (existingWallet) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wallet already exists for this user' 
      });
    }
    
    // Create new wallet
    const newWallet = new Wallet({
      userId: userId,
      walletId: uuidv4(), // Generate unique wallet ID
      balance: {
        amount: 0,
        currency: 'ETB',
        lastUpdated: new Date()
      }
    });
    
    await newWallet.save();
    
    console.log(`✅ Wallet created for user: ${userId}`);
    
    res.status(201).json({
      success: true,
      message: 'Wallet created successfully',
      data: {
        walletId: newWallet.walletId,
        balance: newWallet.balance,
        status: newWallet.status
      }
    });
    
  } catch (error) {
    console.error('❌ Create wallet error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create wallet' 
    });
  }
});

// 2. GET WALLET INFO - Check balance and wallet details
app.get('/api/wallet/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const wallet = await Wallet.findOne({ userId, status: 'active' });
    
    if (!wallet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Wallet not found' 
      });
    }
    
    res.json({
      success: true,
      data: {
        walletId: wallet.walletId,
        balance: wallet.balance,
        linkedBankAccounts: wallet.linkedBankAccounts,
        status: wallet.status,
        kycVerified: wallet.kycVerified
      }
    });
    
  } catch (error) {
    console.error('❌ Get wallet error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get wallet information' 
    });
  }
});

// 3. DEPOSIT MONEY - Add money to wallet via EthSwitch
app.post('/api/wallet/deposit', async (req, res) => {
  try {
    const { userId, amount, bankCode, accountNumber } = req.body;
    
    // Validate input
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid deposit information' 
      });
    }
    
    // Find user's wallet
    const wallet = await Wallet.findOne({ userId, status: 'active' });
    if (!wallet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Wallet not found' 
      });
    }
    
    // Check if user is KYC verified
    if (!wallet.kycVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'KYC verification required before deposits' 
      });
    }
    
    // Create transaction record
    const transaction = new Transaction({
      walletId: wallet.walletId,
      userId: userId,
      transactionId: uuidv4(),
      type: 'deposit',
      amount: parseFloat(amount),
      currency: 'ETB',
      status: 'processing',
      description: `Deposit from ${bankCode}`,
      balanceAfter: 0 // Will be updated after processing
    });
    
    await transaction.save();
    console.log(`💰 Processing deposit for user ${userId}: ${amount} ETB`);
    
    // Simulate EthSwitch API call (replace with real integration)
    const ethswitchResult = await simulateEthSwitchDeposit({
      userId,
      amount,
      bankCode,
      accountNumber,
      transactionId: transaction.transactionId
    });
    
    if (ethswitchResult.success) {
      // Update transaction as completed
      transaction.status = 'completed';
      transaction.ethswitchData = ethswitchResult.data;
      transaction.completedAt = new Date();
      
      // Update wallet balance
      wallet.balance.amount += parseFloat(amount);
      wallet.balance.lastUpdated = new Date();
      
      transaction.balanceAfter = wallet.balance.amount;
      
      // Save both updates
      await Promise.all([
        transaction.save(),
        wallet.save()
      ]);
      
      console.log(`✅ Deposit completed for user ${userId}`);
      
      res.json({
        success: true,
        message: 'Deposit successful',
        data: {
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          newBalance: wallet.balance.amount,
          status: transaction.status
        }
      });
      
    } else {
      // Update transaction as failed
      transaction.status = 'failed';
      transaction.failureReason = ethswitchResult.message;
      await transaction.save();
      
      console.log(`❌ Deposit failed for user ${userId}: ${ethswitchResult.message}`);
      
      res.status(400).json({
        success: false,
        message: `Deposit failed: ${ethswitchResult.message}`,
        transactionId: transaction.transactionId
      });
    }
    
  } catch (error) {
    console.error('❌ Deposit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process deposit' 
    });
  }
});

// 4. WITHDRAW MONEY - Send money from wallet to bank account
app.post('/api/wallet/withdraw', async (req, res) => {
  try {
    const { userId, amount, bankCode, accountNumber } = req.body;
    
    // Validate input
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid withdrawal information' 
      });
    }
    
    const wallet = await Wallet.findOne({ userId, status: 'active' });
    if (!wallet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Wallet not found' 
      });
    }
    
    // Check sufficient balance
    if (wallet.balance.amount < amount) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient balance. Available: ${wallet.balance.amount} ETB` 
      });
    }
    
    // Create withdrawal transaction
    const transaction = new Transaction({
      walletId: wallet.walletId,
      userId: userId,
      transactionId: uuidv4(),
      type: 'withdrawal',
      amount: parseFloat(amount),
      status: 'processing',
      description: `Withdrawal to ${bankCode}`,
      balanceAfter: wallet.balance.amount - parseFloat(amount)
    });
    
    await transaction.save();
    
    // Process withdrawal (simulate EthSwitch)
    const ethswitchResult = await simulateEthSwitchWithdrawal({
      userId,
      amount,
      bankCode,
      accountNumber,
      transactionId: transaction.transactionId
    });
    
    if (ethswitchResult.success) {
      // Complete the withdrawal
      transaction.status = 'completed';
      transaction.ethswitchData = ethswitchResult.data;
      transaction.completedAt = new Date();
      
      // Update wallet balance
      wallet.balance.amount -= parseFloat(amount);
      wallet.balance.lastUpdated = new Date();
      
      await Promise.all([
        transaction.save(),
        wallet.save()
      ]);
      
      console.log(`✅ Withdrawal completed for user ${userId}`);
      
      res.json({
        success: true,
        message: 'Withdrawal successful',
        data: {
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          newBalance: wallet.balance.amount
        }
      });
      
    } else {
      transaction.status = 'failed';
      transaction.failureReason = ethswitchResult.message;
      await transaction.save();
      
      res.status(400).json({
        success: false,
        message: `Withdrawal failed: ${ethswitchResult.message}`
      });
    }
    
  } catch (error) {
    console.error('❌ Withdrawal error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process withdrawal' 
    });
  }
});

// 5. GET TRANSACTION HISTORY
app.get('/api/wallet/:userId/transactions', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(parseInt(limit))
      .skip(skip)
      .select('-ethswitchData'); // Don't send sensitive EthSwitch data
    
    const totalTransactions = await Transaction.countDocuments({ userId });
    
    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalTransactions / limit),
          totalTransactions,
          hasMore: skip + transactions.length < totalTransactions
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Get transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get transaction history' 
    });
  }
});

// ========== HELPER FUNCTIONS ==========

// Simulate EthSwitch deposit (replace with real API)
async function simulateEthSwitchDeposit({ userId, amount, bankCode, accountNumber, transactionId }) {
  console.log(`🔄 Simulating EthSwitch deposit...`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate 90% success rate
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    return {
      success: true,
      data: {
        referenceId: `ETH${Date.now()}`,
        bankCode,
        responseCode: '00',
        responseMessage: 'Success',
        processedAt: new Date()
      }
    };
  } else {
    return {
      success: false,
      message: 'Bank system temporarily unavailable'
    };
  }
}

// Simulate EthSwitch withdrawal (replace with real API)
async function simulateEthSwitchWithdrawal({ userId, amount, bankCode, accountNumber, transactionId }) {
  console.log(`🔄 Simulating EthSwitch withdrawal...`);
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const isSuccess = Math.random() > 0.05; // 95% success rate
  
  if (isSuccess) {
    return {
      success: true,
      data: {
        referenceId: `ETH_OUT_${Date.now()}`,
        bankCode,
        responseCode: '00',
        responseMessage: 'Transfer successful',
        processedAt: new Date()
      }
    };
  } else {
    return {
      success: false,
      message: 'Account number not valid'
    };
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Ethio-Stock Wallet Service',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Wallet Service running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('📦 MongoDB connection closed.');
    process.exit(0);
  });
});