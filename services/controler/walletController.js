const { MongoClient, ObjectId } = require('mongodb');
const SimpleEthSwitchService = require('../services/ethswitchService');

class SimpleWalletController {
  constructor() {
    this.ethswitch = new SimpleEthSwitchService();
    this.db = null;
  }

  // Initialize database connection
  async initDB() {
    if (!this.db) {
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      this.db = client.db(process.env.DB_NAME || 'ethio_stock_trading');
    }
    return this.db;
  }

  // Get user wallet balance
  async getWalletBalance(req, res) {
    try {
      const { userId } = req.params;
      const db = await this.initDB();
      
      const wallet = await db.collection('wallets').findOne({ 
        user_id: new ObjectId(userId) 
      });

      if (!wallet) {
        // Create wallet if doesn't exist
        const newWallet = {
          user_id: new ObjectId(userId),
          balance: 0,
          currency: 'ETB',
          status: 'active',
          created_at: new Date(),
          updated_at: new Date()
        };
        
        await db.collection('wallets').insertOne(newWallet);
        return res.json({ balance: 0, currency: 'ETB' });
      }

      res.json({
        balance: wallet.balance,
        currency: wallet.currency,
        status: wallet.status
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Initiate deposit
  async initiateDeposit(req, res) {
    try {
      const { userId } = req.params;
      const { amount, bank_code } = req.body;

      // Validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      // Initiate deposit with EthSwitch
      const depositResult = await this.ethswitch.initiateDeposit(userId, amount, bank_code);
      
      const db = await this.initDB();
      const bankInfo = this.ethswitch.getBankInfo(bank_code);

      // Save transaction record
      const transaction = {
        user_id: new ObjectId(userId),
        transaction_id: depositResult.transaction_id,
        ethswitch_reference: depositResult.ethswitch_reference,
        type: 'deposit',
        amount: parseFloat(amount),
        currency: 'ETB',
        bank_code: bank_code,
        bank_name: bankInfo.name,
        status: 'pending',
        mobile_redirect_url: depositResult.mobile_redirect_url,
        created_at: new Date()
      };

      await db.collection('wallet_transactions').insertOne(transaction);

      res.json({
        success: true,
        transaction_id: depositResult.transaction_id,
        mobile_redirect_url: depositResult.mobile_redirect_url,
        web_redirect_url: depositResult.web_redirect_url,
        bank_name: bankInfo.name,
        amount: amount,
        currency: 'ETB'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Initiate withdrawal
  async initiateWithdrawal(req, res) {
    try {
      const { userId } = req.params;
      const { amount, bank_code } = req.body;

      // Validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const db = await this.initDB();
      
      // Check wallet balance
      const wallet = await db.collection('wallets').findOne({ 
        user_id: new ObjectId(userId) 
      });

      if (!wallet || wallet.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Initiate withdrawal with EthSwitch
      const withdrawalResult = await this.ethswitch.initiateWithdrawal(userId, amount, bank_code);
      
      const bankInfo = this.ethswitch.getBankInfo(bank_code);

      // Save transaction record
      const transaction = {
        user_id: new ObjectId(userId),
        transaction_id: withdrawalResult.transaction_id,
        ethswitch_reference: withdrawalResult.ethswitch_reference,
        type: 'withdrawal',
        amount: parseFloat(amount),
        currency: 'ETB',
        bank_code: bank_code,
        bank_name: bankInfo.name,
        status: 'pending',
        mobile_redirect_url: withdrawalResult.mobile_redirect_url,
        created_at: new Date()
      };

      await db.collection('wallet_transactions').insertOne(transaction);

      // Temporarily reduce wallet balance (will be restored if transaction fails)
      await db.collection('wallets').updateOne(
        { user_id: new ObjectId(userId) },
        { 
          $inc: { balance: -parseFloat(amount) },
          $set: { updated_at: new Date() }
        }
      );

      res.json({
        success: true,
        transaction_id: withdrawalResult.transaction_id,
        mobile_redirect_url: withdrawalResult.mobile_redirect_url,
        web_redirect_url: withdrawalResult.web_redirect_url,
        bank_name: bankInfo.name,
        amount: amount,
        currency: 'ETB'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get transaction history
  async getTransactionHistory(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const db = await this.initDB();
      
      const transactions = await db.collection('wallet_transactions')
        .find({ user_id: new ObjectId(userId) })
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .toArray();

      const total = await db.collection('wallet_transactions')
        .countDocuments({ user_id: new ObjectId(userId) });

      res.json({
        transactions,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total: total
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Handle EthSwitch webhook (when transaction completes)
  async handleWebhook(req, res) {
    try {
      const { reference, status, transaction_id, amount } = req.body;
      
      const db = await this.initDB();
      
      // Find transaction
      const transaction = await db.collection('wallet_transactions').findOne({
        ethswitch_reference: reference
      });

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Update transaction status
      await db.collection('wallet_transactions').updateOne(
        { ethswitch_reference: reference },
        { 
          $set: { 
            status: status.toLowerCase(),
            completed_at: new Date(),
            updated_at: new Date()
          }
        }
      );

      // Update wallet balance based on transaction result
      if (status === 'COMPLETED') {
        if (transaction.type === 'deposit') {
          // Add money to wallet for successful deposit
          await db.collection('wallets').updateOne(
            { user_id: transaction.user_id },
            { 
              $inc: { balance: transaction.amount },
              $set: { updated_at: new Date() }
            }
          );
        }
        // For withdrawal, money was already deducted, so no action needed
      } else if (status === 'FAILED') {
        if (transaction.type === 'withdrawal') {
          // Refund money to wallet for failed withdrawal
          await db.collection('wallets').updateOne(
            { user_id: transaction.user_id },
            { 
              $inc: { balance: transaction.amount },
              $set: { updated_at: new Date() }
            }
          );
        }
        // For deposit, no money was added yet, so no action needed
      }

      res.json({ success: true, message: 'Webhook processed' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Handle return from mobile banking app
  async handleCallback(req, res) {
    try {
      const { transaction_id, status } = req.query;
      
      // Redirect user back to wallet page with status
      const redirectUrl = `${process.env.FRONTEND_URL}/wallet?transaction=${transaction_id}&status=${status}`;
      res.redirect(redirectUrl);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SimpleWalletController;