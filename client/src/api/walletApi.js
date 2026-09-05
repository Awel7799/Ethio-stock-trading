// frontend/src/api/walletApi.js

import { API_BASE_URL } from "../config/api"

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
  return await apiRequest("/wallet/balance", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Get transaction history
export const getTransactions = async (token, page = 1, limit = 50) => {
  return await apiRequest(`/wallet/transactions?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Initiate deposit
export const initiateDeposit = async (token, depositData) => {
  return await apiRequest("/wallet/deposit", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(depositData),
  })
}

// Initiate withdrawal
export const initiateWithdraw = async (token, withdrawData) => {
  return await apiRequest("/wallet/withdraw", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(withdrawData),
  })
}

// Get transaction status (for polling)
export const getTransactionStatus = async (token, transactionId) => {
  return await apiRequest(`/wallet/transaction/${transactionId}/status`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Get supported banks
export const getSupportedBanks = async (token) => {
  return await apiRequest("/wallet/banks", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}