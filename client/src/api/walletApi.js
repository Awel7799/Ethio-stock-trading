// frontend/src/api/walletApi.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
  }

  return await response.json()
}

// Get wallet balance
export const getBalance = async (token) => {
  return await apiRequest("/api/wallet/balance", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Get transaction history
export const getTransactions = async (token, page = 1, limit = 50) => {
  return await apiRequest(`/api/wallet/transactions?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Initiate deposit
export const initiateDeposit = async (token, depositData) => {
  return await apiRequest("/api/wallet/deposit", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // <-- FIXED: Explicitly setting Content-Type here
    },
    body: JSON.stringify(depositData),
  })
}

// Initiate withdrawal
export const initiateWithdraw = async (token, withdrawData) => {
  return await apiRequest("/api/wallet/withdraw", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // <-- FIXED: Explicitly setting Content-Type here
    },
    body: JSON.stringify(withdrawData),
  })
}

// Get transaction status (for polling)
export const getTransactionStatus = async (token, transactionId) => {
  return await apiRequest(`/api/wallet/transaction/${transactionId}/status`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Get supported banks (if needed from backend)
export const getSupportedBanks = async (token) => {
  return await apiRequest("/api/wallet/banks", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
