"use client"

import { useState } from "react"
import { useWallet } from "../../context/WalletContext" // Assuming useWallet provides user info
import BankSelector from "./BankSelector"

const WithdrawForm = () => {
  // Destructure 'user' from useWallet context
  const { balance, initiateWithdraw, withdrawLoading, supportedBanks, technicalErrors, user } = useWallet()

  const [formData, setFormData] = useState({
    amount: "",
    bankCode: "",
    bankAccount: "",
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState("")

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Amount is required"
      isValid = false
    } else if (Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0"
      isValid = false
    } else if (Number.parseFloat(formData.amount) < 10) {
      newErrors.amount = "Minimum withdrawal amount is 10 ETB"
      isValid = false
    } else if (Number.parseFloat(formData.amount) > balance) {
      newErrors.amount = `Insufficient balance. Available: ${formatCurrency(balance)}`
      isValid = false
    } else if (Number.parseFloat(formData.amount) > 500000) {
      newErrors.amount = "Maximum withdrawal amount is 500,000 ETB"
      isValid = false
    }
    // Bank validation
    if (!formData.bankCode) {
      newErrors.bankCode = "Please select a bank"
      isValid = false
    }
    // Bank account validation
    if (!formData.bankAccount) {
      newErrors.bankAccount = "Bank account number is required"
      isValid = false
    } else if (formData.bankAccount.length < 10) {
      newErrors.bankAccount = "Bank account number must be at least 10 digits"
      isValid = false
    } else if (!/^\d+$/.test(formData.bankAccount)) {
      newErrors.bankAccount = "Bank account number must contain only digits"
      isValid = false
    }

    // REMOVED: Client-side validation for customerName and customerPhone
    // These fields are now optional and will be sent as empty strings if not available from user object.
    // The backend will handle their optionality.

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Clear success message when user modifies form
    if (success) {
      setSuccess("")
    }
  }

  const handleBankSelect = (bankCode) => {
    setFormData((prev) => ({ ...prev, bankCode }))
    if (errors.bankCode) {
      setErrors((prev) => ({ ...prev, bankCode: "" }))
    }
  }

  const handleMaxAmount = () => {
    const maxWithdraw = Math.min(balance, 500000)
    setFormData((prev) => ({ ...prev, amount: maxWithdraw.toString() }))
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Construct customerName and customerPhone from the 'user' object
    // These will now be empty strings if user.firstName, user.lastName, or user.phone are not available,
    // and the backend will accept them as optional.
    const customerName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : ""
    const customerPhone = user ? user.phone || "" : ""
    const customerEmail = user ? user.email || "" : "" // Also include email for consistency

    const result = await initiateWithdraw({
      amount: Number.parseFloat(formData.amount),
      bankCode: formData.bankCode,
      bankAccount: formData.bankAccount,
      description: "Stock trading wallet withdrawal",
      customerName: customerName,
      customerPhone: customerPhone,
      customerEmail: customerEmail,
    })

    if (result.success) {
      setSuccess("Withdrawal initiated successfully! Funds will be transferred to your bank account.")
      setFormData({ amount: "", bankCode: "", bankAccount: "" })
      setErrors({})
    } else {
      setErrors({ submit: result.error || "Failed to initiate withdrawal" })
    }
  }

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return ""
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Make a Withdrawal</h3>
        <p className="text-sm text-gray-600">Transfer money from your trading wallet to your Ethiopian bank account.</p>
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span className="text-gray-500">Available balance:</span>
          <span className="font-semibold text-green-600">ETB {formatCurrency(balance)}</span>
        </div>
      </div>
      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}
      {/* Low Balance Warning */}
      {balance < 100 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">Low Balance</p>
              <p className="text-sm text-yellow-700">Your wallet balance is low. Consider making a deposit first.</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Field */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Withdrawal Amount (ETB)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">ETB</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              min="10"
              max={Math.min(balance, 500000)}
              placeholder="0.00"
              className={`block w-full pl-12 pr-20 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.amount ? "border-red-300" : "border-gray-300"
              }`}
              disabled={withdrawLoading || balance < 10}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                type="button"
                onClick={handleMaxAmount}
                disabled={withdrawLoading || balance < 10}
                className="mr-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                MAX
              </button>
            </div>
          </div>
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
          {formData.amount && (
            <div className="mt-1 flex justify-between text-sm">
              <span className="text-gray-500">Amount: ETB {formatCurrency(formData.amount)}</span>
              <span className="text-gray-500">
                Remaining: ETB {formatCurrency(balance - Number.parseFloat(formData.amount || "0"))}
              </span>
            </div>
          )}
        </div>
        {/* Bank Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Destination Bank</label>
          <BankSelector
            banks={supportedBanks}
            selectedBank={formData.bankCode}
            onBankSelect={handleBankSelect}
            error={errors.bankCode}
            disabled={withdrawLoading}
          />
          {errors.bankCode && <p className="mt-1 text-sm text-red-600">{errors.bankCode}</p>}
        </div>
        {/* Bank Account Field */}
        <div>
          <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 mb-2">
            Destination Bank Account Number
          </label>
          <input
            type="text"
            id="bankAccount"
            name="bankAccount"
            value={formData.bankAccount}
            onChange={handleInputChange}
            placeholder="Enter destination account number"
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.bankAccount ? "border-red-300" : "border-gray-300"
            }`}
            disabled={withdrawLoading}
          />
          {errors.bankAccount && <p className="mt-1 text-sm text-red-600">{errors.bankAccount}</p>}
          <p className="mt-1 text-xs text-gray-500">Enter the account number where you want to receive the money</p>
        </div>
        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm8.707-7.293a1 1 0 00-1.414-1.414L10 10.586 8.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}
        {/* Technical Errors */}
        {technicalErrors.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">System Notice</p>
                <p className="text-sm text-yellow-700 mt-1">Some technical issues detected. Please try again.</p>
              </div>
            </div>
          </div>
        )}
        {/* Submit Button */}
        <button
          type="submit"
          disabled={withdrawLoading || balance < 10}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {withdrawLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </div>
          ) : balance < 10 ? (
            "Insufficient Balance"
          ) : (
            "Initiate Withdrawal"
          )}
        </button>
      </form>
      {/* Information Box */}
      <div className="mt-8 bg-orange-50 border border-orange-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-orange-800">Important Notes</h3>
            <div className="mt-2 text-sm text-orange-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Minimum withdrawal: 10 ETB</li>
                <li>Maximum withdrawal: 500,000 ETB per transaction</li>
                <li>Funds will be transferred to your bank account</li>
                <li>Processing time: Usually 1-3 business hours</li>
                <li>Make sure the account number is correct</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WithdrawForm
