// backend/services/walletService.js
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const ethswitchService = require('./ethswitchService');
const mongoose = require('mongoose');

class WalletService {
  constructor() {
    this.bankNames = {
      cbe: 'Commercial Bank of Ethiopia',
      awash: 'Awash Bank',
      dashen: 'Dashen Bank',
      nib: 'NIB International Bank',
      boa: 'Bank of Abyssinia',
      wegagen: 'Wegagen Bank',
      united: 'United Bank'
    };
  }

  // Get or create wallet for user
  async getOrCreateWallet(userId) {
    try {
      let wallet = await Wallet.findOne({ user_id: userId });
      
      if (!wallet) {
        wallet = await Wallet.createWallet(userId);
      }
      
      return {
        success: true,
        wallet: wallet
      };
    } catch (error) {
      console.error('Get/Create Wallet Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get wallet balance
  async getWalletBalance(userId) {
    try {
      const walletResult = await this.getOrCreateWallet(userId);
      
      if (!walletResult.success) {
        throw new Error(walletResult.error);
      }

      return {
        success: true,
        balance: walletResult.wallet.balance,
        currency: walletResult.wallet.currency,
        formatted_balance: walletResult.wallet.getFormattedBalance()
      };
    } catch (error) {
      console.error('Get Balance Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Initiate deposit
  async initiateDeposit(userId, depositData) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { amount, bank_code, account_number } = depositData;

      // Validate input
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount');
      }

      if (!bank_code || !this.bankNames[bank_code]) {
        throw new Error('Invalid bank selected');
      }

      if (!account_number || !/^[0-9]{13,16}$/.test(account_number)) {
        throw new Error('Invalid account number');
      }

      // Get or create wallet
      const walletResult = await this.getOrCreateWallet(userId);
      if (!walletResult.success) {
        throw new Error(walletResult.error);
      }

      const wallet = walletResult.wallet;

      // Create pending transaction
      const transactionData = {
        user_id: userId,
        wallet_id: wallet._id,
        type: 'deposit',
        amount: parseFloat(amount),
        bank_code: bank_code,
        bank_name: this.bankNames[bank_code],
        account_number: account_number,
        status: 'pending'
      };

      const transaction = await WalletTransaction.createTransaction(transactionData);

      // Initiate EthSwitch transaction
      const ethswitchData = {
        amount: parseFloat(amount),
        bankCode: bank_code,
        accountNumber: account_number,
        transactionId: transaction.ethswitch_transaction_id,
        userId: userId
      };

      let ethswitchResponse;
      
      // Use simulation in development, real API in production
      if (process.env.NODE_ENV === 'development') {
        ethswitchResponse = await ethswitchService.simulateEthSwitchResponse(ethswitchData);
      } else {
        ethswitchResponse = await ethswitchService.initiateDeposit(ethswitchData);
      }

      if (!ethswitchResponse.success) {
        // Update transaction status to failed
        await transaction.updateStatus('failed', {
          failure_reason: ethswitchResponse.error
        });
        
        throw new Error(ethswitchResponse.error);
      }

      // Update transaction with EthSwitch response
      await transaction.updateStatus('processing', {
        ethswitch_reference: ethswitchResponse.ethswitch_reference,
        ussd_code: ethswitchResponse.ussd_code,
        mobile_redirect_url: ethswitchResponse.mobile_redirect_url,
        web_redirect_url: ethswitchResponse.web_redirect_url,
        session_id: ethswitchResponse.session_id
      });

      await session.commitTransaction();

      return {
        success: true,
        transaction_id: transaction.ethswitch_transaction_id,
        bank_name: this.bankNames[bank_code],
        amount: parseFloat(amount),
        ussd_code: ethswitchResponse.ussd_code,
        mobile_redirect_url: ethswitchResponse.mobile_redirect_url,
        web_redirect_url: ethswitchResponse.web_redirect_url,
        message: 'Deposit initiated successfully. Please complete the payment in your mobile banking app.'
      };

    } catch (error) {
      await session.abortTransaction();
      console.error('Initiate Deposit Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to initiate deposit'
      };
    } finally {
      session.endSession();
    }
  }

  // Initiate withdrawal
  async initiateWithdrawal(userId, withdrawalData) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { amount, bank_code, account_number } = withdrawalData;

      // Validate input
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount');
      }

      if (!bank_code || !this.bankNames[bank_code]) {
        throw new Error('Invalid bank selected');
      }

      if (!account_number || !/^[0-9]{13,16}$/.test(account_number)) {
        throw new Error('Invalid account number');
      }

      // Get wallet and check balance
      const walletResult = await this.getOrCreateWallet(userId);
      if (!walletResult.success) {
        throw new Error(walletResult.error);
      }

      const wallet = walletResult.wallet;

      if (wallet.balance < parseFloat(amount)) {
        throw new Error('Insufficient balance');
      }

      // Create pending transaction
      const transactionData = {
        user_id: userId,
        wallet_id: wallet._id,
        type: 'withdraw',
        amount: parseFloat(amount),
        bank_code: bank_code,
        bank_name: this.bankNames[bank_code],
        account_number: account_number,
        status: 'pending'
      };

      const transaction = await WalletTransaction.createTransaction(transactionData);

      // Optimistically deduct from wallet (will be reversed if transaction fails)
      await wallet.updateBalance(parseFloat(amount), 'subtract');

      // Initiate EthSwitch transaction
      const ethswitchData = {
        amount: parseFloat(amount),
        bankCode: bank_code,
        accountNumber: account_number,
        transactionId: transaction.ethswitch_transaction_id,
        userId: userId
      };

      let ethswitchResponse;
      
      if (process.env.NODE_ENV === 'development') {
        ethswitchResponse = await ethswitchService.simulateEthSwitchResponse(ethswitchData);
      } else {
        ethswitchResponse = await ethswitchService.initiateWithdrawal(ethswitchData);
      }

      if (!ethswitchResponse.success) {
        // Reverse the balance deduction
        await wallet.updateBalance(parseFloat(amount), 'add');
        
        // Update transaction status to failed
        await transaction.updateStatus('failed', {
          failure_reason: ethswitchResponse.error
        });
        
        throw new Error(ethswitchResponse.error);
      }

      // Update transaction with EthSwitch response
      await transaction.updateStatus('processing', {
        ethswitch_reference: ethswitchResponse.ethswitch_reference,
        ussd_code: ethswitchResponse.ussd_code,
        mobile_redirect_url: ethswitchResponse.mobile_redirect_url,
        web_redirect_url: ethswitchResponse.web_redirect_url,
        session_id: ethswitchResponse.session_id
      });

      await session.commitTransaction();

      return {
        success: true,
        transaction_id: transaction.ethswitch_transaction_id,
        bank_name: this.bankNames[bank_code],
        amount: parseFloat(amount),
        ussd_code: ethswitchResponse.ussd_code,
        mobile_redirect_url: ethswitchResponse.mobile_redirect_url,
        web_redirect_url: ethswitchResponse.web_redirect_url,
        message: 'Withdrawal initiated successfully. Please complete the confirmation in your mobile banking app.',
        new_balance: wallet.balance
      };

    } catch (error) {
      await session.abortTransaction();
      console.error('Initiate Withdrawal Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to initiate withdrawal'
      };
    } finally {
      session.endSession();
    }
  }

  // Handle EthSwitch callback
  async handleCallback(callbackData, signature) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Verify callback signature
      if (!ethswitchService.verifyCallback(callbackData, signature)) {
        throw new Error('Invalid callback signature');
      }

      const { transaction_id, status, amount, fees, failure_reason } = callbackData;

      // Find transaction
      const transaction = await WalletTransaction.findOne({
        ethswitch_transaction_id: transaction_id
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Get wallet
      const wallet = await Wallet.findById(transaction.wallet_id);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (status === 'completed') {
        // Transaction successful
        if (transaction.type === 'deposit') {
          // Add money to wallet
          await wallet.updateBalance(transaction.amount, 'add');
        }
        // For withdrawal, money was already deducted optimistically

        // Update transaction
        await transaction.updateStatus('completed', {
          response_code: callbackData.response_code,
          response_message: callbackData.response_message
        });

        // Update fees if provided
        if (fees) {
          transaction.fees = {
            ethswitch_fee: fees.ethswitch_fee || 0,
            bank_fee: fees.bank_fee || 0,
            our_fee: fees.our_fee || 0,
            total_fee: fees.total_fee || 0
          };
          await transaction.save();
        }

      } else if (status === 'failed' || status === 'cancelled') {
        // Transaction failed
        if (transaction.type === 'withdraw') {
          // Reverse the optimistic deduction
          await wallet.updateBalance(transaction.amount, 'add');
        }

        // Update transaction
        await transaction.updateStatus(status, {
          failure_reason: failure_reason || 'Transaction failed',
          response_code: callbackData.response_code,
          response_message: callbackData.response_message
        });
      }

      await session.commitTransaction();

      return {
        success: true,
        transaction_id: transaction_id,
        status: status,
        message: 'Callback processed successfully'
      };

    } catch (error) {
      await session.abortTransaction();
      console.error('Handle Callback Error:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      session.endSession();
    }
  }

  // Get transaction history
  async getTransactionHistory(userId, options = {}) {
    try {
      const { page = 1, limit = 20, type = null, status = null } = options;
      
      const query = { user_id: userId };
      
      if (type) query.type = type;
      if (status) query.status = status;

      const transactions = await WalletTransaction.find(query)
        .sort({ initiated_at: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('wallet_id', 'balance');

      const total = await WalletTransaction.countDocuments(query);

      return {
        success: true,
        transactions: transactions.map(tx => ({
          _id: tx._id,
          type: tx.type,
          amount: tx.amount,
          formatted_amount: tx.getFormattedAmount(),
          bank_name: tx.bank_name,
          bank_code: tx.bank_code,
          status: tx.status,
          initiated_at: tx.initiated_at,
          completed_at: tx.completed_at,
          duration: tx.getDuration(),
          ethswitch_transaction_id: tx.ethswitch_transaction_id,
          failure_reason: tx.failure_reason
        })),
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_transactions: total,
          has_next: page < Math.ceil(total / limit),
          has_prev: page > 1
        }
      };

    } catch (error) {
      console.error('Get Transaction History Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check transaction status
  async checkTransactionStatus(userId, transactionId) {
    try {
      const transaction = await WalletTransaction.findOne({
        user_id: userId,
        ethswitch_transaction_id: transactionId
      });

      if (!transaction) {
        return {
          success: false,
          error: 'Transaction not found'
        };
      }

      // If transaction is still processing, check with EthSwitch
      if (transaction.status === 'processing' || transaction.status === 'pending') {
        const ethswitchStatus = await ethswitchService.checkTransactionStatus(transactionId);
        
        if (ethswitchStatus.success && ethswitchStatus.status !== transaction.status) {
          // Update transaction status based on EthSwitch response
          await this.handleCallback({
            transaction_id: transactionId,
            status: ethswitchStatus.status,
            amount: ethswitchStatus.amount,
            fees: ethswitchStatus.fees,
            failure_reason: ethswitchStatus.failure_reason,
            response_code: '200',
            response_message: 'Status check update'
          }, 'internal_check');
        }
      }

      return {
        success: true,
        transaction: {
          id: transaction.ethswitch_transaction_id,
          type: transaction.type,
          amount: transaction.amount,
          formatted_amount: transaction.getFormattedAmount(),
          bank_name: transaction.bank_name,
          status: transaction.status,
          initiated_at: transaction.initiated_at,
          completed_at: transaction.completed_at,
          duration: transaction.getDuration(),
          failure_reason: transaction.failure_reason
        }
      };

    } catch (error) {
      console.error('Check Transaction Status Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get wallet summary
  async getWalletSummary(userId) {
    try {
      const walletResult = await this.getWalletBalance(userId);
      if (!walletResult.success) {
        throw new Error(walletResult.error);
      }

      // Get recent transactions
      const recentTransactions = await this.getTransactionHistory(userId, { limit: 5 });

      // Get transaction stats
      const stats = await WalletTransaction.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: '$type',
            total_amount: { $sum: '$amount' },
            count: { $sum: 1 },
            completed_count: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            }
          }
        }
      ]);

      const summary = {
        balance: walletResult.balance,
        formatted_balance: walletResult.formatted_balance,
        currency: walletResult.currency,
        total_deposits: 0,
        total_withdrawals: 0,
        deposit_count: 0,
        withdrawal_count: 0,
        success_rate: 0
      };

      stats.forEach(stat => {
        if (stat._id === 'deposit') {
          summary.total_deposits = stat.total_amount;
          summary.deposit_count = stat.count;
        } else if (stat._id === 'withdraw') {
          summary.total_withdrawals = stat.total_amount;
          summary.withdrawal_count = stat.count;
        }
      });

      // Calculate success rate
      const totalTransactions = summary.deposit_count + summary.withdrawal_count;
      const totalCompleted = stats.reduce((sum, stat) => sum + stat.completed_count, 0);
      summary.success_rate = totalTransactions > 0 ? (totalCompleted / totalTransactions * 100).toFixed(1) : 0;

      return {
        success: true,
        summary: summary,
        recent_transactions: recentTransactions.success ? recentTransactions.transactions : []
      };

    } catch (error) {
      console.error('Get Wallet Summary Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new WalletService();