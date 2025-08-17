// utils/validation.js - Input Validation
// Validates user input for wallet operations

const { ethswitchConfig } = require("../config/ethswitch")
const mongoose = require("mongoose") // Ensure mongoose is required for ObjectId validation

// Validation rules
const validationRules = {
  amount: {
    min: 10, // Minimum 10 ETB
    max: 1000000, // Maximum 1,000,000 ETB
  },
  accountNumber: {
    minLength: 10,
    maxLength: 20,
  },
}

// Validate deposit request (RELAXED RULES)
const validateDepositRequest = (data) => {
  const errors = []

  // Validate amount
  if (!data.amount) {
    errors.push("Amount is required")
  } else {
    const amount = Number.parseFloat(data.amount)
    if (isNaN(amount) || amount <= 0) {
      errors.push("Amount must be a positive number")
    } else if (amount < validationRules.amount.min) {
      errors.push(`Minimum deposit amount is ${validationRules.amount.min} ETB`)
    } else if (amount > validationRules.amount.max) {
      errors.push(`Maximum deposit amount is ${validationRules.amount.max} ETB`)
    }
  }

  // Validate bank selection
  if (!data.bankCode) {
    errors.push("Bank selection is required")
  } else {
    const validBank = ethswitchConfig.supportedBanks.find((bank) => bank.code === data.bankCode)
    if (!validBank) {
      errors.push("Invalid bank selection")
    }
  }

  // Validate bank account (RELAXED: only presence required)
  if (!data.bankAccount) {
    errors.push("Bank account number is required")
  }

  // Validate customer name (optional)
  if (data.customerName && data.customerName.trim().length < 2) {
    errors.push("Customer name must be at least 2 characters")
  }

  // Validate phone number format (optional)
  if (data.customerPhone && data.customerPhone.trim() !== "") {
    const phoneRegex = /^(\+251|0)[0-9]{9}$/
    const cleanPhone = data.customerPhone.replace(/\s/g, "")

    if (!phoneRegex.test(cleanPhone)) {
      errors.push("Invalid Ethiopian phone number format")
    }
  }

  // Validate email format (optional)
  if (data.customerEmail && data.customerEmail.trim() !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.customerEmail)) {
      errors.push("Invalid email format")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizeDepositData(data) : null,
  }
}

// Validate withdrawal request (MODIFIED: customerName and customerPhone are now optional)
const validateWithdrawRequest = (data, currentBalance) => {
  const errors = []

  // Validate amount
  if (!data.amount) {
    errors.push("Amount is required")
  } else {
    const amount = Number.parseFloat(data.amount)
    if (isNaN(amount) || amount <= 0) {
      errors.push("Amount must be a positive number")
    } else if (amount < validationRules.amount.min) {
      errors.push(`Minimum withdrawal amount is ${validationRules.amount.min} ETB`)
    } else if (amount > validationRules.amount.max) {
      errors.push(`Maximum withdrawal amount is ${validationRules.amount.max} ETB`)
    } else if (amount > currentBalance) {
      errors.push("Insufficient balance for withdrawal")
    }
  }

  // Validate bank selection
  if (!data.bankCode) {
    errors.push("Bank selection is required")
  } else {
    const validBank = ethswitchConfig.supportedBanks.find((bank) => bank.code === data.bankCode)
    if (!validBank) {
      errors.push("Invalid bank selection")
    }
  }

  // Validate bank account (STRICT)
  if (!data.bankAccount) {
    errors.push("Bank account number is required")
  } else {
    const cleanAccount = data.bankAccount.replace(/\D/g, "")
    if (cleanAccount.length < validationRules.accountNumber.minLength) {
      errors.push(`Account number must be at least ${validationRules.accountNumber.minLength} digits`)
    } else if (cleanAccount.length > validationRules.accountNumber.maxLength) {
      errors.push(`Account number cannot exceed ${validationRules.accountNumber.maxLength} digits`)
    }
  }

  // Customer name is now optional for withdrawals
  if (data.customerName && data.customerName.trim().length > 0 && data.customerName.trim().length < 2) {
    errors.push("Customer name must be at least 2 characters if provided")
  }

  // Phone number is now optional for withdrawals
  if (data.customerPhone && data.customerPhone.trim() !== "") {
    const phoneRegex = /^(\+251|0)[0-9]{9}$/
    const cleanPhone = data.customerPhone.replace(/\s/g, "")

    if (!phoneRegex.test(cleanPhone)) {
      errors.push("Invalid Ethiopian phone number format if provided")
    }
  }

  // Validate email format (optional)
  if (data.customerEmail && data.customerEmail.trim() !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.customerEmail)) {
      errors.push("Invalid email format")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizeWithdrawData(data) : null,
  }
}

// Sanitize deposit data
const sanitizeDepositData = (data) => {
  return {
    amount: Number.parseFloat(data.amount),
    bankCode: data.bankCode.trim().toUpperCase(),
    bankAccount: data.bankAccount.replace(/\D/g, ""),
    customerName: data.customerName ? data.customerName.trim() : "",
    customerPhone: data.customerPhone ? data.customerPhone.replace(/\s/g, "") : "",
    customerEmail: data.customerEmail ? data.customerEmail.trim().toLowerCase() : "",
    description: data.description ? data.description.trim() : "Stock trading wallet deposit",
  }
}

// Sanitize withdrawal data (MODIFIED: customerName and customerPhone are now optional)
const sanitizeWithdrawData = (data) => {
  return {
    amount: Number.parseFloat(data.amount),
    bankCode: data.bankCode.trim().toUpperCase(),
    bankAccount: data.bankAccount.replace(/\D/g, ""),
    customerName: data.customerName ? data.customerName.trim() : "", // Now optional
    customerPhone: data.customerPhone ? data.customerPhone.replace(/\s/g, "") : "", // Now optional
    customerEmail: data.customerEmail ? data.customerEmail.trim().toLowerCase() : "",
    description: data.description ? data.description.trim() : "Stock trading wallet withdrawal",
  }
}

// Validate MongoDB ObjectId
const validateObjectId = (id) => {
  // Ensure mongoose is available for ObjectId validation
  return mongoose.Types.ObjectId.isValid(id)
}

// Validate pagination parameters
const validatePaginationParams = (page, limit) => {
  const pageNum = Number.parseInt(page) || 1
  const limitNum = Number.parseInt(limit) || 20

  return {
    page: Math.max(1, pageNum),
    limit: Math.min(Math.max(1, limitNum), 100), // Max 100 items per page
    skip: (Math.max(1, pageNum) - 1) * Math.min(Math.max(1, limitNum), 100),
  }
}

// Validate transaction status filter
const validateStatusFilter = (status) => {
  const validStatuses = ["initiated", "pending", "completed", "failed"]

  if (!status) return null

  const statusArray = Array.isArray(status) ? status : [status]
  const validStatusArray = statusArray.filter((s) => validStatuses.includes(s))

  return validStatusArray.length > 0 ? validStatusArray : null
}

module.exports = {
  validateDepositRequest,
  validateWithdrawRequest,
  validateObjectId,
  validatePaginationParams,
  validateStatusFilter,
  validationRules,
}
