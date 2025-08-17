"use client"

import { createContext, useContext, useState, useEffect } from "react"
import * as walletApi from "../api/walletApi"
import { useAuth } from "./AuthContext"
import { isAuthenticated, getAccessToken } from "../api/auth" // Import getAccessToken directly

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const { user, isLoggedIn, loading: authLoading } = useAuth()

  // Use the same function from auth.js to get the token
  const getToken = () => {
    return getAccessToken()
  }

  // Balance State
  const [balance, setBalance] = useState(0)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [balanceError, setBalanceError] = useState(null)

  // Transactions State
  const [transactions, setTransactions] = useState([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [transactionsError, setTransactionsError] = useState(null)
  const [pendingTransactions, setPendingTransactions] = useState([])

  // Form States
  const [depositLoading, setDepositLoading] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(false)

  // Error States (Technical errors for debugging)
  const [technicalErrors, setTechnicalErrors] = useState([])

  // Banks
  const [supportedBanks, setSupportedBanks] = useState([
    { code: "CBE", name: "Commercial Bank of Ethiopia" },
    { code: "DB", name: "Dashen Bank" },
    { code: "AIB", name: "Awash International Bank" },
    { code: "BOA", name: "Bank of Abyssinia" },
    { code: "CBO", name: "Cooperative Bank of Oromia" },
    { code: "DBE", name: "Development Bank of Ethiopia" },
    { code: "UB", name: "United Bank S.C." },
    { code: "LIB", name: "Lion International Bank" },
    { code: "NIB", name: "Nib International Bank" },
    { code: "WB", name: "Wegagen Bank" },
  ])
  const [banksLoading, setBanksLoading] = useState(false)

  // Polling interval reference
  const [pollingInterval, setPollingInterval] = useState(null)

  // Better token checking
  const checkAuthAndToken = () => {
    const token = getToken()
    const authenticated = isAuthenticated() && isLoggedIn && !authLoading

    if (!authenticated) {
      addTechnicalError("User not authenticated")
      return { valid: false, token: null }
    }

    if (!token) {
      addTechnicalError("No authentication token found")
      return { valid: false, token: null }
    }

    return { valid: true, token }
  }

  // Refresh Balance
  const refreshBalance = async () => {
    const { valid, token } = checkAuthAndToken()
    if (!valid) return

    setBalanceLoading(true)
    setBalanceError(null)

    try {
      console.log("🔄 Fetching balance with token:", token ? "Present" : "Missing")
      const response = await walletApi.getBalance(token)
      console.log("✅ Balance response:", response)

      if (response.success) {
        setBalance(response.data.balance || 0)
      } else {
        setBalanceError(response.message || "Failed to fetch balance")
        addTechnicalError(`Balance fetch failed: ${response.message}`)
      }
    } catch (error) {
      console.error("❌ Balance fetch error:", error)
      setBalanceError("Failed to fetch balance")
      addTechnicalError(`Balance fetch error: ${error.message}`)
    } finally {
      setBalanceLoading(false)
    }
  }

  // Refresh Transactions
  const refreshTransactions = async () => {
    const { valid, token } = checkAuthAndToken()
    if (!valid) return

    setTransactionsLoading(true)
    setTransactionsError(null)

    try {
      console.log("🔄 Fetching transactions with token:", token ? "Present" : "Missing")
      const response = await walletApi.getTransactions(token)
      console.log("✅ Transactions response:", response)
      console.log("📊 Response data structure:", JSON.stringify(response.data, null, 2))

      if (response.success) {
        let transactionsList = []

        if (Array.isArray(response.data)) {
          // Backend returns transactions directly as array in data field
          transactionsList = response.data
        } else if (response.data && Array.isArray(response.data.transactions)) {
          // Backend returns { transactions: [...], pagination: {...} }
          transactionsList = response.data.transactions
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Backend returns { data: [...] }
          transactionsList = response.data.data
        } else {
          // Fallback - empty array
          transactionsList = []
        }

        console.log("📋 Transactions array:", transactionsList)
        console.log("📋 Transactions count:", transactionsList.length)
        setTransactions(transactionsList)

        // Separate pending transactions
        const pending = transactionsList.filter((t) => t.status === "initiated" || t.status === "pending")
        setPendingTransactions(pending)
      } else {
        setTransactionsError(response.message || "Failed to fetch transactions")
        addTechnicalError(`Transactions fetch failed: ${response.message}`)
      }
    } catch (error) {
      console.error("❌ Transactions fetch error:", error)
      setTransactionsError("Failed to fetch transactions")
      addTechnicalError(`Transactions fetch error: ${error.message}`)
    } finally {
      setTransactionsLoading(false)
    }
  }

  // Add Transaction (Optimistic Updates)
  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev])
    if (transaction.status === "initiated" || transaction.status === "pending") {
      setPendingTransactions((prev) => [transaction, ...prev])
    }
  }

  // Update Transaction Status
  const updateTransaction = (ethswitchTransactionId, newStatus) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.ethswitch_transaction_id === ethswitchTransactionId ? { ...t, status: newStatus, updated_at: new Date() } : t,
      ),
    )
    // Update pending transactions
    if (newStatus === "completed" || newStatus === "failed") {
      setPendingTransactions((prev) => prev.filter((t) => t.ethswitch_transaction_id !== ethswitchTransactionId))

      // Refresh balance if transaction completed
      if (newStatus === "completed") {
        refreshBalance()
      }
    }
  }

  // Initiate Deposit
  const initiateDeposit = async (depositData) => {
    // Changed to accept an object
    const { valid, token } = checkAuthAndToken()
    if (!valid) {
      return { success: false, error: "Authentication required" }
    }
    setDepositLoading(true)

    try {
      console.log("🔄 Initiating deposit with token:", token ? "Present" : "Missing")
      // Pass depositData directly to the API call
      const response = await walletApi.initiateDeposit(token, depositData)

      console.log("✅ Deposit response:", response)
      if (response.success) {
        // Add optimistic transaction
        const optimisticTransaction = {
          _id: response.data.transaction_id,
          user_id: user.id,
          amount: depositData.amount,
          type: "deposit",
          status: "initiated",
          bank_code: depositData.bankCode, // Changed from bank_name to bank_code
          bank_account: depositData.bankAccount,
          ethswitch_transaction_id: response.data.ethswitch_transaction_id,
          description: `Deposit from ${depositData.bankCode}`, // Changed to use bankCode
          created_at: new Date(),
          updated_at: new Date(),
        }

        addTransaction(optimisticTransaction)
        startPolling()

        return { success: true, transaction_id: response.data.transaction_id }
      } else {
        addTechnicalError(`Deposit initiation failed: ${response.message}`)
        return { success: false, error: response.message || "Failed to initiate deposit" }
      }
    } catch (error) {
      console.error("❌ Deposit API error:", error)
      addTechnicalError(`Deposit API error: ${error.message}`)
      return { success: false, error: "Failed to initiate deposit" }
    } finally {
      setDepositLoading(false)
    }
  }

  // Initiate Withdraw
  const initiateWithdraw = async (withdrawData) => {
    // Changed to accept an object
    const { valid, token } = checkAuthAndToken()
    if (!valid) {
      return { success: false, error: "Authentication required" }
    }
    setWithdrawLoading(true)

    try {
      console.log("🔄 Initiating withdrawal with token:", token ? "Present" : "Missing")
      // Pass withdrawData directly to the API call
      const response = await walletApi.initiateWithdraw(token, withdrawData)

      console.log("✅ Withdrawal response:", response)
      if (response.success) {
        // Add optimistic transaction
        const optimisticTransaction = {
          _id: response.data.transaction_id,
          user_id: user.id,
          amount: withdrawData.amount,
          type: "withdraw",
          status: "initiated",
          bank_code: withdrawData.bankCode, // Changed from bank_name to bank_code
          bank_account: withdrawData.bankAccount,
          ethswitch_transaction_id: response.data.ethswitch_transaction_id,
          description: `Withdrawal to ${withdrawData.bankCode}`, // Changed to use bankCode
          created_at: new Date(),
          updated_at: new Date(),
        }

        addTransaction(optimisticTransaction)

        // Update balance optimistically (subtract withdrawal amount)
        setBalance((prev) => prev - withdrawData.amount) // Use withdrawData.amount

        startPolling()

        return { success: true, transaction_id: response.data.transaction_id }
      } else {
        addTechnicalError(`Withdrawal initiation failed: ${response.message}`)
        return { success: false, error: response.message || "Failed to initiate withdrawal" }
      }
    } catch (error) {
      console.error("❌ Withdrawal API error:", error)
      addTechnicalError(`Withdrawal API error: ${error.message}`)
      return { success: false, error: "Failed to initiate withdrawal" }
    } finally {
      setWithdrawLoading(false)
    }
  }

  // Clear Errors
  const clearErrors = () => {
    setTechnicalErrors([])
    setBalanceError(null)
    setTransactionsError(null)
  }

  // Add Technical Error
  const addTechnicalError = (error) => {
    const errorObj = {
      id: Date.now(),
      message: error,
      timestamp: new Date(),
    }
    setTechnicalErrors((prev) => [errorObj, ...prev.slice(0, 4)]) // Keep only last 5 errors
    console.error("🔧 Technical Error:", error)
  }

  // Poll Pending Transactions
  const pollPendingTransactions = async () => {
    const { valid, token } = checkAuthAndToken()
    if (!valid || pendingTransactions.length === 0) return

    try {
      const response = await walletApi.getTransactions(token)
      if (response.success) {
        const latestTransactions = response.data.transactions || []

        // Check for status updates in pending transactions
        pendingTransactions.forEach((pendingTx) => {
          const updatedTx = latestTransactions.find(
            (t) => t.ethswitch_transaction_id === pendingTx.ethswitch_transaction_id,
          )

          if (updatedTx && updatedTx.status !== pendingTx.status) {
            updateTransaction(updatedTx.ethswitch_transaction_id, updatedTx.status)
          }
        })
      }
    } catch (error) {
      // Silent polling error - don't add to technical errors for polling failures
      console.warn("⚠️ Polling error:", error.message)
    }
  }

  // Start Polling
  const startPolling = () => {
    if (pollingInterval) return // Already polling

    const interval = setInterval(pollPendingTransactions, 5000) // Poll every 5 seconds
    setPollingInterval(interval)
    console.log("🔄 Started transaction polling")
  }

  // Stop Polling
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
      console.log("⏹️ Stopped transaction polling")
    }
  }

  // Effects
  useEffect(() => {
    // Wait for auth to finish loading before making API calls
    if (!authLoading && isLoggedIn && user) {
      console.log("🚀 Auth loaded, initializing wallet data")
      refreshBalance()
      refreshTransactions()
    }
  }, [authLoading, isLoggedIn, user])

  // Start/stop polling based on pending transactions
  useEffect(() => {
    if (pendingTransactions.length > 0) {
      startPolling()
    } else {
      stopPolling()
    }

    return () => stopPolling() // Cleanup on unmount
  }, [pendingTransactions.length])

  // Stop polling on unmount
  useEffect(() => {
    return () => stopPolling()
  }, [])

  const value = {
    // Balance State
    balance,
    balanceLoading,
    balanceError,

    // Transactions State
    transactions,
    transactionsLoading,
    transactionsError,
    pendingTransactions,

    // Form States
    depositLoading,
    withdrawLoading,

    // Error States
    technicalErrors,

    // Banks
    supportedBanks,
    banksLoading,

    // User object from AuthContext (now exposed)
    user,

    // Functions
    refreshBalance,
    refreshTransactions,
    addTransaction,
    updateTransaction,
    initiateDeposit,
    initiateWithdraw,
    clearErrors,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
