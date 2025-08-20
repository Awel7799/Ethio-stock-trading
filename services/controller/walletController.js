// controllers/walletController.js - Wallet Business Logic (FIXED)
// Handles all wallet operations including deposits, withdrawals, and transaction management
//note here this is anothere controllers fiel
const Wallet = require("../models/Wallet")
const WalletTransaction = require("../models/WalletTransaction")
const User = require("../models/User")
const ethswitchService = require("../services/ethswitchService")
const { ethswitchConfig } = require("../config/ethswitch")
const {
  validateDepositRequest,
  validateWithdrawRequest,
  validateObjectId,
  validatePaginationParams,
  validateStatusFilter,
} = require("../utils/validation")
const {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  serverErrorResponse,
  transactionResponse,
  walletBalanceResponse,
  paginationResponse,
  bankListResponse,
  transactionInitiationResponse,
  webhookSuccessResponse,
  webhookErrorResponse,
} = require("../utils/responseHelper")

// Get wallet balance
const getWalletBalance = async (req, res) => {
  try {
    console.log("🔍 WALLET BALANCE: Request received")
    console.log("🔍 WALLET BALANCE: req.user:", req.user)
    
    // FIXED: Use req.user.userId (from auth middleware) instead of req.user.id
    const userId = req.user.userId
    console.log("✅ WALLET BALANCE: User ID:", userId)

    let wallet = await Wallet.findOne({ userId: userId })
    console.log("📊 WALLET BALANCE: Wallet found:", wallet ? `Balance: ${wallet.balance}` : 'Not found')

    if (!wallet) {
      console.log("🆕 WALLET BALANCE: Creating new wallet for user:", userId)
      // Create wallet if it doesn't exist
      wallet = new Wallet({
        userId: userId,
        balance: 0,
      })
      await wallet.save()
      console.log("✅ WALLET BALANCE: New wallet created")
    }

    console.log("✅ WALLET BALANCE: Returning balance:", wallet.balance)
    return successResponse(res, walletBalanceResponse(wallet), "Wallet balance retrieved successfully")
  } catch (error) {
    console.error("❌ WALLET BALANCE: Error:", error)
    return serverErrorResponse(res, "Failed to retrieve wallet balance")
  }
}

// Initiate deposit (FIXED)
const initiateDeposit = async (req, res) => {
  try {
    // FIXED: Use req.user.userId instead of req.user.id
    const userId = req.user.userId

    // Log request for debugging - THIS IS THE NEW LINE
    console.log("DEBUG: req.body at start of initiateDeposit:", req.body)

    // Validate input
    // Basic validation only
    if (!req.body.amount || !req.body.bankCode || !req.body.bankAccount) {
      return validationErrorResponse(res, ["Amount, bank code, and bank account are required"])
    }

    // Create sanitized data manually
    const depositData = {
      amount: Number.parseFloat(req.body.amount),
      bankCode: req.body.bankCode,
      bankAccount: req.body.bankAccount,
      description: req.body.description || "Stock trading wallet deposit",
      customerName: req.body.customerName || "",
      customerPhone: req.body.customerPhone || "",
      customerEmail: req.body.customerEmail || "",
    }

    // Get user information
    const user = await User.findById(userId)
    if (!user) {
      console.error("User not found for deposit:", userId)
      return notFoundResponse(res, "User")
    }

    // Get or create wallet
    let wallet = await Wallet.findOne({ userId: userId })
    if (!wallet) {
      wallet = new Wallet({
        userId: userId,
        balance: 0,
      })
      await wallet.save()
      console.log("New wallet created for user:", userId)
    }

    // Create transaction record
    const transaction = new WalletTransaction({
      userId: userId,
      amount: depositData.amount,
      type: "deposit",
      status: "initiated",
      bank_name: ethswitchConfig.supportedBanks.find((bank) => bank.code === depositData.bankCode)?.name,
      bank_account: depositData.bankAccount,
      description: depositData.description,
    })

    // Add this line:
    console.log("DEBUG: Transaction object before save:", transaction.toObject())

    // The next line should be:
    await transaction.save()
    console.log("Transaction created:", transaction._id)

    // Prepare EthSwitch request data with robust fallbacks
    const ethswitchData = {
      amount: depositData.amount,
      bankCode: depositData.bankCode,
      bankAccount: depositData.bankAccount,
      // FIX: Use request data first, then user data, then defaults
      customerName: depositData.customerName || user.name || user.email || "No name provided",
      customerPhone: depositData.customerPhone || user.phone || "No phone provided",
      customerEmail: depositData.customerEmail || user.email || "No email provided",
      description: depositData.description,
    }

    console.log("Calling EthSwitch with:", ethswitchData)

    // Initiate transaction with EthSwitch
    const ethswitchResult = await ethswitchService.initiateDeposit(ethswitchData)

    if (!ethswitchResult.success) {
      console.error("EthSwitch deposit failed:", ethswitchResult.error)

      // Update transaction status to failed
      transaction.status = "failed"
      transaction.description += ` - ${ethswitchResult.error}`
      await transaction.save()

      return errorResponse(res, ethswitchResult.error, 400)
    }

    // Update transaction with EthSwitch details
    transaction.ethswitch_transaction_id = ethswitchResult.data.ethswitch_transaction_id
    transaction.status = "pending"
    await transaction.save()

    console.log("Deposit initiated successfully:", transaction._id)

    return successResponse(
      res,
      transactionInitiationResponse(transaction, ethswitchResult.data),
      "Deposit initiated successfully",
      201,
    )
  } catch (error) {
    console.error("Initiate deposit error:", error)
    return serverErrorResponse(res, "Failed to initiate deposit")
  }
}

// Initiate withdrawal (FIXED)
const initiateWithdraw = async (req, res) => {
  try {
    // FIXED: Use req.user.userId instead of req.user.id
    const userId = req.user.userId
    console.log("Withdrawal request received:", req.body)

    // Get current wallet balance
    const wallet = await Wallet.findOne({ userId: userId })
    if (!wallet) {
      console.error("Wallet not found for withdrawal:", userId)
      return notFoundResponse(res, "Wallet")
    }

    // Validate input including balance check
    const validation = validateWithdrawRequest(req.body, wallet.balance)
    if (!validation.isValid) {
      console.error("Withdrawal validation failed:", validation.errors)
      return validationErrorResponse(res, validation.errors)
    }

    const withdrawData = validation.sanitizedData

    // Get user information
    const user = await User.findById(userId)
    if (!user) {
      console.error("User not found for withdrawal:", userId)
      return notFoundResponse(res, "User")
    }

    // Create transaction record
    const transaction = new WalletTransaction({
      userId: userId,
      amount: withdrawData.amount,
      type: "withdraw",
      status: "initiated",
      bank_name: ethswitchConfig.supportedBanks.find((bank) => bank.code === withdrawData.bankCode)?.name,
      bank_account: withdrawData.bankAccount,
      description: withdrawData.description,
    })

    await transaction.save()
    console.log("Withdrawal transaction created:", transaction._id)

    // Prepare EthSwitch request data
    const ethswitchData = {
      amount: withdrawData.amount,
      bankCode: withdrawData.bankCode,
      bankAccount: withdrawData.bankAccount,
      customerName: withdrawData.customerName,
      customerPhone: withdrawData.customerPhone,
      customerEmail: withdrawData.customerEmail,
      description: withdrawData.description,
    }

    console.log("Calling EthSwitch for withdrawal:", ethswitchData)

    // Initiate transaction with EthSwitch
    const ethswitchResult = await ethswitchService.initiateWithdraw(ethswitchData)

    if (!ethswitchResult.success) {
      console.error("EthSwitch withdrawal failed:", ethswitchResult.error)

      // Update transaction status to failed
      transaction.status = "failed"
      transaction.description += ` - ${ethswitchResult.error}`
      await transaction.save()

      return errorResponse(res, ethswitchResult.error, 400)
    }

    // Update transaction with EthSwitch details
    transaction.ethswitch_transaction_id = ethswitchResult.data.ethswitch_transaction_id
    transaction.status = "pending"
    await transaction.save()

    // Reduce wallet balance (will be reverted if transaction fails)
    wallet.balance -= withdrawData.amount
    await wallet.save()
    console.log("Wallet balance updated:", wallet.balance)

    return successResponse(
      res,
      transactionInitiationResponse(transaction, ethswitchResult.data),
      "Withdrawal initiated successfully",
      201,
    )
  } catch (error) {
    console.error("Initiate withdraw error:", error)
    return serverErrorResponse(res, "Failed to initiate withdrawal")
  }
}

// Get transaction history
const getTransactionHistory = async (req, res) => {
  try {
    // FIXED: Use req.user.userId instead of req.user.id
    const userId = req.user.userId
    const { page: reqPage, limit: reqLimit, status } = req.query

    // Validate pagination parameters
    const { page, limit, skip } = validatePaginationParams(reqPage, reqLimit)

    // Validate status filter
    const statusFilter = validateStatusFilter(status)

    // Get transactions with pagination
    const [transactions, total] = await WalletTransaction.getUserTransactionHistory(userId, page, limit, statusFilter)

    const formattedTransactions = transactions.map((transaction) => transactionResponse(transaction, true))

    return successResponse(
      res,
      paginationResponse(formattedTransactions, page, limit, total),
      "Transaction history retrieved successfully",
    )
  } catch (error) {
    console.error("Get transaction history error:", error)
    return serverErrorResponse(res, "Failed to retrieve transaction history")
  }
}

// Get transaction details
const getTransactionDetails = async (req, res) => {
  try {
    // FIXED: Use req.user.userId instead of req.user.id
    const userId = req.user.userId
    const { transactionId } = req.params

    // Validate transaction ID
    if (!validateObjectId(transactionId)) {
      return errorResponse(res, "Invalid transaction ID", 400)
    }

    const transaction = await WalletTransaction.findOne({
      _id: transactionId,
      userId: userId,
    })

    if (!transaction) {
      return notFoundResponse(res, "Transaction")
    }

    return successResponse(res, transactionResponse(transaction, true), "Transaction details retrieved successfully")
  } catch (error) {
    console.error("Get transaction details error:", error)
    return serverErrorResponse(res, "Failed to retrieve transaction details")
  }
}

// Get pending transactions (for real-time polling)
const getPendingTransactions = async (req, res) => {
  try {
    // FIXED: Use req.user.userId instead of req.user.id
    const userId = req.user.userId

    const pendingTransactions = await WalletTransaction.findPendingTransactions(userId)

    const formattedTransactions = pendingTransactions.map((transaction) => transactionResponse(transaction, true))

    return successResponse(res, formattedTransactions, "Pending transactions retrieved successfully")
  } catch (error) {
    console.error("Get pending transactions error:", error)
    return serverErrorResponse(res, "Failed to retrieve pending transactions")
  }
}

// Get supported banks
const getSupportedBanks = async (req, res) => {
  try {
    const banks = ethswitchService.getSupportedBanks()
    console.log("Retrieved supported banks:", banks.length)

    return successResponse(res, bankListResponse(banks), "Supported banks retrieved successfully")
  } catch (error) {
    console.error("Get supported banks error:", error)
    return serverErrorResponse(res, "Failed to retrieve supported banks")
  }
}

// Handle EthSwitch webhooks/callbacks (FIXED)
const handleEthSwitchCallback = async (req, res) => {
  try {
    // Webhook data is already validated by middleware
    const webhookData = req.validatedWebhookData
    console.log("Received EthSwitch callback:", webhookData)

    // Find the transaction by EthSwitch transaction ID
    const transaction = await WalletTransaction.findByEthSwitchId(webhookData.transaction_id)

    if (!transaction) {
      console.warn("Transaction not found for callback:", webhookData.transaction_id)
      return webhookErrorResponse(res, "Transaction not found", 404)
    }

    // Get user wallet
    const wallet = await Wallet.findOne({ userId: transaction.userId })
    if (!wallet) {
      console.error("Wallet not found for transaction:", transaction._id)
      return webhookErrorResponse(res, "Wallet not found", 404)
    }

    const previousStatus = transaction.status
    const newStatus = webhookData.status

    console.log(`Updating transaction ${transaction._id} from ${previousStatus} to ${newStatus}`)

    // Update transaction status
    transaction.status = newStatus

    if (webhookData.completed_at) {
      transaction.updated_at = new Date(webhookData.completed_at)
    }

    if (webhookData.failed_reason) {
      transaction.description += ` - ${webhookData.failed_reason}`
    }

    await transaction.save()

    // Handle balance updates
    if (newStatus === "completed" && previousStatus !== "completed") {
      if (transaction.type === "deposit") {
        wallet.balance += transaction.amount
        await wallet.save()
        console.log(`Deposit completed: +${transaction.amount} ETB to ${transaction.userId}`)
      }
    } else if (newStatus === "failed" && transaction.type === "withdraw" && previousStatus === "pending") {
      wallet.balance += transaction.amount
      await wallet.save()
      console.log(`Withdrawal failed: +${transaction.amount} ETB refunded to ${transaction.userId}`)
    }

    console.log("Callback processed successfully")
    return webhookSuccessResponse(res, "Callback processed successfully")
  } catch (error) {
    console.error("Callback processing error:", error)
    return webhookErrorResponse(res, "Failed to process callback", 500)
  }
}

// Query transaction status from EthSwitch (manual check)
const queryTransactionStatus = async (req, res) => {
  try {
    // FIXED: Use req.user.userId instead of req.user.id
    const userId = req.user.userId
    const { transactionId } = req.params

    // Validate transaction ID
    if (!validateObjectId(transactionId)) {
      return errorResponse(res, "Invalid transaction ID", 400)
    }

    const transaction = await WalletTransaction.findOne({
      _id: transactionId,
      userId: userId,
    })

    if (!transaction) {
      return notFoundResponse(res, "Transaction")
    }

    if (!transaction.ethswitch_transaction_id) {
      return errorResponse(res, "Transaction not submitted to EthSwitch", 400)
    }

    // Query EthSwitch for current status
    const ethswitchResult = await ethswitchService.queryTransaction(transaction.ethswitch_transaction_id)

    if (!ethswitchResult.success) {
      return errorResponse(res, ethswitchResult.error, 400)
    }

    // Update local transaction if status changed
    const ethswitchStatus = ethswitchResult.data.status.toLowerCase()
    if (transaction.status !== ethswitchStatus) {
      transaction.status = ethswitchStatus
      await transaction.save()

      // Handle balance updates if needed
      const wallet = await Wallet.findOne({ userId: userId })
      if (wallet && ethswitchStatus === "completed" && transaction.type === "deposit") {
        wallet.balance += transaction.amount
        await wallet.save()
      }
    }

    return successResponse(
      res,
      {
        local_transaction: transactionResponse(transaction, true),
        ethswitch_data: ethswitchResult.data,
      },
      "Transaction status updated successfully",
    )
  } catch (error) {
    console.error("Query transaction status error:", error)
    return serverErrorResponse(res, "Failed to query transaction status")
  }
}

module.exports = {
  getWalletBalance,
  initiateDeposit,
  initiateWithdraw,
  getTransactionHistory,
  getTransactionDetails,
  getPendingTransactions,
  getSupportedBanks,
  handleEthSwitchCallback,
  queryTransactionStatus,
}