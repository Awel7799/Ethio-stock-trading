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
