<<<<<<< HEAD
// backend/routes/wallet.js
const express = require('express');
const router = express.Router();
const walletService = require('../services/walletService');
const auth = require('../middleware/auth'); // Your JWT auth middleware
const rateLimit = require('express-rate-limit');

// Rate limiting for wallet operations
const walletRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 transactions per 15 minutes
  message: {
    success: false,
    error: 'Too many transaction attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const depositWithdrawLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Max 3 deposit/withdraw attempts per 5 minutes
  message: {
    success: false,
    error: 'Too many deposit/withdraw attempts. Please wait 5 minutes.'
  }
});

// Input validation middleware
const validateTransactionInput = (req, res, next) => {
  const { amount, bank_code, account_number } = req.body;

  // Validate amount
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Valid amount is required'
    });
  }

  // Validate amount range (minimum 10 ETB, maximum 100,000 ETB)
  const amountNum = parseFloat(amount);
  if (amountNum < 10 || amountNum > 100000) {
    return res.status(400).json({
      success: false,
      error: 'Amount must be between 10 and 100,000 ETB'
    });
  }

  // Validate bank code
  const validBanks = ['cbe', 'awash', 'dashen', 'nib', 'boa', 'wegagen', 'united'];
  if (!bank_code || !validBanks.includes(bank_code)) {
    return res.status(400).json({
      success: false,
      error: 'Valid bank selection is required'
    });
  }

  // Validate account number
  if (!account_number || !/^[0-9]{13,16}$/.test(account_number)) {
    return res.status(400).json({
      success: false,
      error: 'Valid account number is required (13-16 digits)'
    });
  }

  next();
};

// GET /api/wallet/:userId/balance - Get wallet balance
router.get('/:userId/balance', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure user can only access their own wallet
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const result = await walletService.getWalletBalance(userId);

    if (result.success) {
      res.json({
        success: true,
        balance: result.balance,
        currency: result.currency,
        formatted_balance: result.formatted_balance
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Get Balance Route Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/wallet/:userId/deposit - Initiate deposit
router.post('/:userId/deposit', 
  auth, 
  walletRateLimit, 
  depositWithdrawLimit, 
  validateTransactionInput, 
  async (req, res) => {
    try {
      const { userId } = req.params;

      // Ensure user can only access their own wallet
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      const { amount, bank_code, account_number } = req.body;

      const result = await walletService.initiateDeposit(userId, {
        amount,
        bank_code,
        account_number
      });

      if (result.success) {
        res.json({
          success: true,
          transaction_id: result.transaction_id,
          bank_name: result.bank_name,
          amount: result.amount,
          ussd_code: result.ussd_code,
          mobile_redirect_url: result.mobile_redirect_url,
          web_redirect_url: result.web_redirect_url,
          message: result.message
        });
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Deposit Route Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
);

// POST /api/wallet/:userId/withdrawal - Initiate withdrawal
router.post('/:userId/withdrawal', 
  auth, 
  walletRateLimit, 
  depositWithdrawLimit, 
  validateTransactionInput, 
  async (req, res) => {
    try {
      const { userId } = req.params;

      // Ensure user can only access their own wallet
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      const { amount, bank_code, account_number } = req.body;

      const result = await walletService.initiateWithdrawal(userId, {
        amount,
        bank_code,
        account_number
      });

      if (result.success) {
        res.json({
          success: true,
          transaction_id: result.transaction_id,
          bank_name: result.bank_name,
          amount: result.amount,
          ussd_code: result.ussd_code,
          mobile_redirect_url: result.mobile_redirect_url,
          web_redirect_url: result.web_redirect_url,
          message: result.message,
          new_balance: result.new_balance
        });
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Withdrawal Route Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
);

// GET /api/wallet/:userId/transactions - Get transaction history
router.get('/:userId/transactions', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure user can only access their own wallet
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { page = 1, limit = 20, type, status } = req.query;

    const result = await walletService.getTransactionHistory(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      status
    });

    if (result.success) {
      res.json({
        success: true,
        transactions: result.transactions,
        pagination: result.pagination
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Transaction History Route Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/wallet/:userId/transaction/:transactionId - Get specific transaction
router.get('/:userId/transaction/:transactionId', auth, async (req, res) => {
  try {
    const { userId, transactionId } = req.params;

    // Ensure user can only access their own wallet
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const result = await walletService.checkTransactionStatus(userId, transactionId);

    if (result.success) {
      res.json({
        success: true,
        transaction: result.transaction
      });
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Transaction Status Route Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/wallet/:userId/summary - Get wallet summary
router.get('/:userId/summary', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure user can only access their own wallet
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const result = await walletService.getWalletSummary(userId);

    if (result.success) {
      res.json({
        success: true,
        summary: result.summary,
        recent_transactions: result.recent_transactions
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Wallet Summary Route Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/wallet/callback - EthSwitch webhook callback
router.post('/callback', async (req, res) => {
  try {
    const signature = req.headers['x-ethswitch-signature'];
    const callbackData = req.body;

    console.log('🔔 EthSwitch Callback Received:', {
      transaction_id: callbackData.transaction_id,
      status: callbackData.status,
      timestamp: new Date().toISOString()
    });

    const result = await walletService.handleCallback(callbackData, signature);

    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Callback Route Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/wallet/banks - Get supported banks
router.get('/banks', (req, res) => {
  const banks = {
    cbe: {
      code: 'cbe',
      name: 'Commercial Bank of Ethiopia',
      logo: '/images/banks/cbe.png',
      color: '#1e40af',
      ussd: '*847#'
    },
    awash: {
      code: 'awash',
      name: 'Awash Bank',
      logo: '/images/banks/awash.png',
      color: '#dc2626',
      ussd: '*805#'
    },
    dashen: {
      code: 'dashen',
      name: 'Dashen Bank',
      logo: '/images/banks/dashen.png',
      color: '#059669',
      ussd: '*804#'
    },
    nib: {
      code: 'nib',
      name: 'NIB International Bank',
      logo: '/images/banks/nib.png',
      color: '#7c3aed',
      ussd: '*806#'
    },
    boa: {
      code: 'boa',
      name: 'Bank of Abyssinia',
      logo: '/images/banks/boa.png',
      color: '#ea580c',
      ussd: '*803#'
    },
    wegagen: {
      code: 'wegagen',
      name: 'Wegagen Bank',
      logo: '/images/banks/wegagen.png',
      color: '#0891b2',
      ussd: '*807#'
    },
    united: {
      code: 'united',
      name: 'United Bank',
      logo: '/images/banks/united.png',
      color: '#be123c',
      ussd: '*808#'
    }
  };

  res.json({
    success: true,
    banks: banks
  });
});

// Error handling middleware for this router
router.use((error, req, res, next) => {
  console.error('Wallet Route Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

module.exports = router;
=======
const express = require("express")
const router = express.Router()

// ============================================
// IMMEDIATE DEBUG ROUTES (FIRST PRIORITY)
// These routes are placed BEFORE any global authentication middleware
// ============================================

// ABSOLUTE FIRST ROUTE - Test if we can reach routes at all
router.all("/ping", (req, res) => {
  console.log("🏓 PING - Route reached successfully!")
  console.log("🏓 PING - Method:", req.method)
  console.log("🏓 PING - Body:", req.body)
  res.json({
    success: true,
    message: "PING successful - routes are working!",
    method: req.method,
    body: req.body,
  })
})

// Test route 1: No middleware - just body parsing
router.post("/debug-body", (req, res) => {
  console.log("🔍 DEBUG BODY - req.body:", req.body)
  console.log("🔍 DEBUG BODY - Content-Type:", req.headers["content-type"])
  res.json({
    success: true,
    message: "Debug body test",
    receivedBody: req.body,
    contentType: req.headers["content-type"],
  })
})

// Test route that was already there - MOVED TO PUBLIC SECTION
router.post("/test-deposit", (req, res) => {
  console.log("TEST ROUTE - req.body:", req.body)
  res.json({
    success: true,
    message: "Test route working!",
    receivedData: req.body,
  })
})

// Test route 2: With auth middleware (will be applied later if this route is moved)
router.post("/debug-auth", (req, res) => {
  console.log("🔍 DEBUG AUTH - req.body:", req.body)
  console.log("🔍 DEBUG AUTH - req.user:", req.user)
  res.json({
    success: true,
    message: "Debug auth test",
    receivedBody: req.body,
    user: req.user,
  })
})

// Test route 3: Exact same as deposit but simplified
router.post("/debug-deposit", async (req, res) => {
  try {
    console.log("🔍 DEBUG DEPOSIT - req.body:", req.body)

    // Simple validation test
    if (!req.body.amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
        receivedData: req.body,
      })
    }

    res.json({
      success: true,
      message: "Debug deposit would work",
      receivedData: req.body,
    })
  } catch (error) {
    console.error("Debug deposit error:", error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// ============================================
// Middleware and Controllers Imports (Existing)
// ============================================
const authMiddleware = require("../middleware/authMiddleware")
const {
  verifyEthSwitchSignature,
  validateWebhookPayload,
  webhookRateLimit,
  logWebhookRequest,
  webhookErrorHandler,
} = require("../middleware/ethswitchAuth")

const {
  getWalletBalance,
  initiateDeposit, // Make sure initiateDeposit is imported
  initiateWithdraw,
  getTransactionHistory,
  getTransactionDetails,
  getPendingTransactions,
  getSupportedBanks,
  handleEthSwitchCallback,
  queryTransactionStatus,
} = require("../controller/walletController")

// ============================================
// PUBLIC ROUTES (No authentication required - Existing)
// ============================================

// Get supported banks
router.get("/banks", getSupportedBanks)

// EthSwitch webhook callback (with signature verification)
router.post(
  "/callback",
  webhookRateLimit,
  logWebhookRequest,
  verifyEthSwitchSignature,
  validateWebhookPayload,
  handleEthSwitchCallback,
  webhookErrorHandler,
)

// ============================================
// PROTECTED ROUTES (Authentication required - Existing)
// ============================================

// Apply authentication middleware to all routes below
router.use(authMiddleware)

// ============================================
// WALLET BALANCE ROUTES (Existing)
// ============================================

// Get wallet balance
router.get("/balance", getWalletBalance)

// ============================================
// TRANSACTION ROUTES (Existing)
// ============================================

// Initiate deposit - MOVED BACK HERE TO BE PROTECTED BY AUTH MIDDLEWARE
// POST /api/wallet/deposit
// Body: { amount, bankCode, bankAccount, customerName?, customerPhone?, customerEmail?, description? }
router.post("/deposit", initiateDeposit)

// Initiate withdrawal
router.post("/withdraw", initiateWithdraw)

// Get transaction history with pagination and filtering
router.get("/transactions", getTransactionHistory)

// Get pending transactions (for real-time polling)
router.get("/transactions/pending", getPendingTransactions)

// Get specific transaction details
router.get("/transactions/:transactionId", getTransactionDetails)

// Query transaction status from EthSwitch (manual refresh)
router.post("/transactions/:transactionId/status", queryTransactionStatus)

// ============================================
// ROUTE DOCUMENTATION (for development - Existing)
// ============================================

if (process.env.NODE_ENV === "development") {
  router.get("/docs", (req, res) => {
    const routes = {
      debug_routes: {
        "POST /api/wallet/debug-body": "Test body parsing (no auth)",
        "POST /api/wallet/test-deposit": "Test route (no auth)",
        "POST /api/wallet/debug-auth": "Test auth middleware",
        "POST /api/wallet/debug-deposit": "Test deposit logic (simplified)",
      },
      public_routes: {
        "GET /api/wallet/banks": "Get list of supported banks",
        "POST /api/wallet/callback": "EthSwitch webhook callback (signature verification required)",
      },
      authenticated_routes: {
        "GET /api/wallet/balance": "Get current wallet balance",
        "POST /api/wallet/deposit": "Initiate deposit transaction", // Now requires auth
        "POST /api/wallet/withdraw": "Initiate withdrawal transaction",
        "GET /api/wallet/transactions": "Get paginated transaction history",
        "GET /api/wallet/transactions/pending": "Get pending transactions for polling",
        "GET /api/wallet/transactions/:id": "Get specific transaction details",
        "POST /api/wallet/transactions/:id/status": "Query transaction status from EthSwitch",
      },
      query_parameters: {
        page: "Page number for pagination (default: 1)",
        limit: "Items per page (default: 20, max: 100)",
        status: "Filter by status: initiated,pending,completed,failed",
      },
      headers_required: {
        authenticated_routes: "Authorization: Bearer <jwt_token>",
        webhook_callback: "X-Signature: <signature>, X-Timestamp: <timestamp>",
      },
      response_format: {
        success: {
          success: true,
          message: "Operation successful",
          data: "{ ... }",
          timestamp: "2025-01-20T10:30:00.000Z",
        },
        error: {
          success: false,
          message: "Error description",
          errors: '["validation error 1", "validation error 2"]',
          timestamp: "2025-01-20T10:30:00.000Z",
        },
      },
    }
    res.json({
      title: "Wallet API Documentation (WITH DEBUG ROUTES)",
      description: "Real money wallet system with EthSwitch integration",
      version: "1.0.0",
      base_url: "/api/wallet",
      ...routes,
    })
  })
}

module.exports = router
>>>>>>> 60dc1cc7022b0995052367456b85f704619caf38
