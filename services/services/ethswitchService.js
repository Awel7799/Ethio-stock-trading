const axios = require("axios")
const crypto = require("crypto")
const { ethswitchConfig } = require("../config/ethswitch")
const WalletTransaction = require("../models/WalletTransaction") // Moved here for early loading
const Wallet = require("../models/Wallet") // Moved here for early loading

class EthSwitchService {
  constructor() {
    this.baseURL = ethswitchConfig.baseURL
    this.apiKey = ethswitchConfig.apiKey
    this.apiSecret = ethswitchConfig.apiSecret
    this.merchantId = ethswitchConfig.merchantId

    // Explicitly determine mode based on ethswitchConfig.mode
    // This allows 'mock', 'test', or 'sandbox' to trigger mock behavior
    this.isMockMode = ["mock", "test", "sandbox"].includes(ethswitchConfig.mode)

    if (this.isMockMode) {
      console.log("🔧 EthSwitchService: Running in MOCK/SANDBOX MODE (configured via ETHSWITCH_MODE)")
    } else {
      console.log("✅ EthSwitchService: Running in LIVE MODE (configured via ETHSWITCH_MODE)")
    }

    // Create axios instance only if not in mock mode
    // This client will be used for actual API calls to EthSwitch
    if (!this.isMockMode) {
      this.client = axios.create({
        baseURL: this.baseURL,
        timeout: 30000, // 30 seconds timeout for API calls
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey, // API Key for authentication
        },
      })

      // Add a response interceptor to log errors from Axios
      this.client.interceptors.response.use(
        (response) => response,
        (error) => {
          console.error("Axios request failed:", error.response?.data || error.message)
          return Promise.reject(error) // Propagate the error
        },
      )
    }
  }

  /**
   * Generates a SHA256 HMAC signature for API requests.
   * @param {object} payload - The request body.
   * @param {string} timestamp - The timestamp used in the request headers.
   * @returns {string} The generated signature in hex format.
   */
  generateSignature(payload, timestamp) {
    // Ensure payload is a string for consistent hashing
    const data = JSON.stringify(payload) + timestamp
    return crypto.createHmac("sha256", this.apiSecret).update(data).digest("hex")
  }

  /**
   * Generates a unique transaction reference for EthSwitch.
   * @returns {string} A unique transaction reference string.
   */
  generateTransactionRef() {
    return `TXN_${Date.now()}_${crypto.randomBytes(4).toString("hex").toUpperCase()}`
  }

  /**
   * Generates a mock transaction ID for testing purposes.
   * @returns {string} A mock transaction ID.
   */
  generateMockTransactionId() {
    return `MOCK_${Date.now()}_${crypto.randomBytes(6).toString("hex").toUpperCase()}`
  }

  /**
   * Generates a mock deposit response for testing.
   * @param {object} depositData - The deposit request data.
   * @returns {object} A simulated successful deposit response.
   */
  generateMockDepositResponse(depositData) {
    const transactionRef = this.generateTransactionRef()
    const mockTransactionId = this.generateMockTransactionId()

    console.log(
      `🎭 MOCK DEPOSIT: ${depositData.amount} ETB from ${depositData.bankCode} account ${depositData.bankAccount}`,
    )

    return {
      success: true,
      data: {
        ethswitch_transaction_id: mockTransactionId,
        transaction_ref: transactionRef,
        status: "pending",
        redirect_url: null, // No redirect needed for mock
        message: "Mock deposit initiated successfully - will complete in 2-5 seconds",
      },
    }
  }

  /**
   * Generates a mock withdrawal response for testing.
   * @param {object} withdrawData - The withdrawal request data.
   * @returns {object} A simulated successful withdrawal response.
   */
  generateMockWithdrawResponse(withdrawData) {
    const transactionRef = this.generateTransactionRef()
    const mockTransactionId = this.generateMockTransactionId()

    console.log(
      `🎭 MOCK WITHDRAWAL: ${withdrawData.amount} ETB to ${withdrawData.bankCode} account ${withdrawData.bankAccount}`,
    )

    return {
      success: true,
      data: {
        ethswitch_transaction_id: mockTransactionId,
        transaction_ref: transactionRef,
        status: "pending",
        message: "Mock withdrawal initiated successfully - will complete in 2-5 seconds",
      },
    }
  }

  /**
   * Simulates transaction completion for mock mode.
   * This function updates the transaction status in the database and adjusts wallet balance.
   * @param {string} ethswitchTransactionId - The EthSwitch transaction ID to simulate completion for.
   * @param {'deposit' | 'withdraw'} type - The type of transaction.
   */
  simulateTransactionCompletion(ethswitchTransactionId, type) {
    // Simulate EthSwitch callback after a random delay between 2-5 seconds
    setTimeout(
      async () => {
        try {
          console.log(`🎭 MOCK CALLBACK: Simulating ${type} completion for ${ethswitchTransactionId}`)

          const transaction = await WalletTransaction.findOne({
            ethswitch_transaction_id: ethswitchTransactionId,
          })

          if (transaction) {
            // Only update if status is still 'initiated' or 'pending'
            if (transaction.status === "initiated" || transaction.status === "pending") {
              transaction.status = "completed"
              transaction.updated_at = new Date()
              await transaction.save()

              // Update wallet balance for deposits
              if (type === "deposit") {
                const wallet = await Wallet.findOne({ userId: transaction.userId })
                if (wallet) {
                  wallet.balance += transaction.amount
                  await wallet.save()
                  console.log(
                    `🎭 MOCK: Deposit completed - Added ${transaction.amount} ETB to wallet for user ${transaction.userId}`,
                  )
                }
              }
              console.log(`🎭 MOCK: Transaction ${ethswitchTransactionId} marked as completed in DB.`)
            } else {
              console.log(
                `🎭 MOCK: Transaction ${ethswitchTransactionId} already processed (status: ${transaction.status}), skipping mock completion.`,
              )
            }
          } else {
            console.warn(
              `🎭 MOCK: Transaction with ethswitch_transaction_id ${ethswitchTransactionId} not found for mock completion.`,
            )
          }
        } catch (error) {
          console.error("Mock callback simulation error:", error)
        }
      },
      Math.random() * 3000 + 2000,
    ) // Random delay between 2-5 seconds
  }

  /**
   * Helper to extract a meaningful error message from an Axios error object.
   * @param {object} error - The Axios error object.
   * @returns {string} A user-friendly error message.
   */
  _getErrorMessage(error) {
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message
    }
    if (error.message) {
      return error.message
    }
    return "An unknown error occurred"
  }

  /**
   * Initiates a deposit transaction with EthSwitch.
   * @param {object} depositData - The data for the deposit.
   * @returns {Promise<object>} A promise that resolves with the transaction result.
   */
  async initiateDeposit(depositData) {
    try {
      // If in mock mode, return mock response and simulate completion
      if (this.isMockMode) {
        const mockResponse = this.generateMockDepositResponse(depositData)
        this.simulateTransactionCompletion(mockResponse.data.ethswitch_transaction_id, "deposit")
        return mockResponse
      }

      // Real API call to EthSwitch
      const timestamp = Date.now().toString()
      const transactionRef = this.generateTransactionRef()

      const payload = {
        merchant_id: this.merchantId,
        transaction_ref: transactionRef,
        amount: depositData.amount,
        currency: "ETB",
        customer_bank_code: depositData.bankCode,
        customer_account: depositData.bankAccount,
        destination_account: ethswitchConfig.centralBankAccount,
        destination_bank_code: ethswitchConfig.centralBankCode,
        description: `Deposit to wallet - ${depositData.description || "Stock trading wallet deposit"}`,
        callback_url: `${process.env.BASE_URL || "http://localhost:5000"}/api/wallet/callback`, // Ensure BASE_URL is set in .env
        customer_info: {
          name: depositData.customerName,
          phone: depositData.customerPhone || "",
          email: depositData.customerEmail || "",
        },
        transaction_type: "DEPOSIT",
      }

      const signature = this.generateSignature(payload, timestamp)

      const response = await this.client.post("/transactions/initiate", payload, {
        headers: {
          "X-Timestamp": timestamp,
          "X-Signature": signature,
        },
      })

      return {
        success: true,
        data: {
          ethswitch_transaction_id: response.data.transaction_id,
          transaction_ref: transactionRef,
          status: response.data.status,
          redirect_url: response.data.redirect_url,
          message: response.data.message,
        },
      }
    } catch (error) {
      console.error("EthSwitch deposit initiation error:", error.response?.data || error.message)
      return {
        success: false,
        error: this._getErrorMessage(error),
        code: error.response?.status || 500,
      }
    }
  }

  /**
   * Initiates a withdrawal transaction with EthSwitch.
   * @param {object} withdrawData - The data for the withdrawal.
   * @returns {Promise<object>} A promise that resolves with the transaction result.
   */
  async initiateWithdraw(withdrawData) {
    try {
      // If in mock mode, return mock response and simulate completion
      if (this.isMockMode) {
        const mockResponse = this.generateMockWithdrawResponse(withdrawData)
        this.simulateTransactionCompletion(mockResponse.data.ethswitch_transaction_id, "withdraw")
        return mockResponse
      }

      // Real API call to EthSwitch
      const timestamp = Date.now().toString()
      const transactionRef = this.generateTransactionRef()

      const payload = {
        merchant_id: this.merchantId,
        transaction_ref: transactionRef,
        amount: withdrawData.amount,
        currency: "ETB",
        source_account: ethswitchConfig.centralBankAccount,
        source_bank_code: ethswitchConfig.centralBankCode,
        customer_bank_code: withdrawData.bankCode,
        customer_account: withdrawData.bankAccount,
        description: `Withdrawal from wallet - ${withdrawData.description || "Stock trading wallet withdrawal"}`,
        callback_url: `${process.env.BASE_URL || "http://localhost:5000"}/api/wallet/callback`, // Ensure BASE_URL is set in .env
        customer_info: {
          name: withdrawData.customerName,
          phone: withdrawData.customerPhone || "",
          email: withdrawData.customerEmail || "",
        },
        transaction_type: "WITHDRAW",
      }

      const signature = this.generateSignature(payload, timestamp)

      const response = await this.client.post("/transactions/initiate", payload, {
        headers: {
          "X-Timestamp": timestamp,
          "X-Signature": signature,
        },
      })

      return {
        success: true,
        data: {
          ethswitch_transaction_id: response.data.transaction_id,
          transaction_ref: transactionRef,
          status: response.data.status,
          message: response.data.message,
        },
      }
    } catch (error) {
      console.error("EthSwitch withdrawal initiation error:", error.response?.data || error.message)
      return {
        success: false,
        error: this._getErrorMessage(error),
        code: error.response?.status || 500,
      }
    }
  }

  /**
   * Queries the status of a transaction from EthSwitch.
   * @param {string} ethswitchTransactionId - The EthSwitch transaction ID to query.
   * @returns {Promise<object>} A promise that resolves with the transaction status.
   */
  async queryTransaction(ethswitchTransactionId) {
    try {
      // If in mock mode, return mock response
      if (this.isMockMode) {
        console.log(`🎭 MOCK QUERY: Checking status for ${ethswitchTransactionId}`)

        // For mock mode, always return completed status
        return {
          success: true,
          data: {
            status: "completed",
            amount: 0, // Amount will be filled from database in WalletContext
            transaction_ref: ethswitchTransactionId,
            completed_at: new Date().toISOString(),
            message: "Mock transaction completed successfully",
          },
        }
      }

      // Real API call to EthSwitch
      const timestamp = Date.now().toString()
      const payload = {
        merchant_id: this.merchantId,
        transaction_id: ethswitchTransactionId,
      }

      const signature = this.generateSignature(payload, timestamp)

      // Assuming EthSwitch API uses GET for query with headers for signature
      const response = await this.client.get(`/transactions/${ethswitchTransactionId}`, {
        headers: {
          "X-Timestamp": timestamp,
          "X-Signature": signature,
        },
      })

      return {
        success: true,
        data: {
          status: response.data.status,
          amount: response.data.amount,
          transaction_ref: response.data.transaction_ref,
          completed_at: response.data.completed_at,
          message: response.data.message,
        },
      }
    } catch (error) {
      console.error("EthSwitch transaction query error:", error.response?.data || error.message)
      return {
        success: false,
        error: this._getErrorMessage(error),
        code: error.response?.status || 500,
      }
    }
  }

  /**
   * Verifies the signature of an incoming EthSwitch webhook.
   * @param {object} payload - The webhook body.
   * @param {string} receivedSignature - The signature received in the webhook header.
   * @param {string} timestamp - The timestamp received in the webhook header.
   * @returns {boolean} True if the signature is valid, false otherwise.
   */
  verifyWebhookSignature(payload, receivedSignature, timestamp) {
    // In mock mode, always return true for simplicity
    if (this.isMockMode) {
      console.log("🎭 MOCK: Webhook signature verification skipped")
      return true
    }

    // Ensure payload is a string for consistent hashing
    const data = JSON.stringify(payload) + timestamp
    const expectedSignature = crypto.createHmac("sha256", this.apiSecret).update(data).digest("hex")

    // Use timingSafeEqual to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(expectedSignature, "hex"), Buffer.from(receivedSignature, "hex"))
  }

  /**
   * Returns the list of supported banks from the EthSwitch configuration.
   * @returns {Array<object>} An array of supported bank objects.
   */
  getSupportedBanks() {
    return ethswitchConfig.supportedBanks
  }

  /**
   * Validates the format of a bank account number.
   * @param {string} bankCode - The code of the bank (can be used for bank-specific rules).
   * @param {string} accountNumber - The account number to validate.
   * @returns {object} An object indicating validity and a message.
   */
  validateBankAccount(bankCode, accountNumber) {
    // Basic validation - can be enhanced based on bank-specific rules
    if (!accountNumber) {
      return {
        valid: false,
        message: "Account number is required",
      }
    }

    // Remove spaces and non-numeric characters
    const cleanAccount = accountNumber.replace(/\D/g, "")

    if (cleanAccount.length < 10 || cleanAccount.length > 20) {
      return {
        valid: false,
        message: "Invalid account number format (must be between 10-20 digits)",
      }
    }

    return {
      valid: true,
      cleanAccount,
    }
  }

  /**
   * Checks if the EthSwitch service is configured and ready for production use.
   * @returns {boolean} True if ready for production, false otherwise.
   */
  isProductionReady() {
    // A service is production ready if it's not in mock mode and all required credentials are set
    return (
      !this.isMockMode &&
      !!this.baseURL &&
      !!this.apiKey &&
      !!this.apiSecret &&
      !!this.merchantId &&
      !!ethswitchConfig.centralBankAccount &&
      !!ethswitchConfig.centralBankCode
    )
  }

  /**
   * Provides the current status of the EthSwitch service for debugging/monitoring.
   * @returns {object} An object containing service status details.
   */
  getServiceStatus() {
    return {
      mode: ethswitchConfig.mode, // Reflects the configured mode (e.g., 'mock', 'sandbox', 'production')
      production_ready: this.isProductionReady(),
      base_url: this.baseURL,
      merchant_configured: !!this.merchantId,
      api_key_configured: !!this.apiKey,
      api_secret_configured: !!this.apiSecret,
      central_account_configured: !!ethswitchConfig.centralBankAccount && !!ethswitchConfig.centralBankCode,
    }
  }
}

module.exports = new EthSwitchService()
