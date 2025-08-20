"use client";

import { useState } from "react";
import { useWallet } from "../../context/WalletContext";
import BankSelector from "./BankSelector.jsx";

const DepositForm = () => {
  const { initiateDeposit, depositLoading, supportedBanks, technicalErrors } =
    useWallet();

  // ✅ FIXED: Changed bankName to bankCode
  const [formData, setFormData] = useState({
    amount: "",
    bankCode: "", // ✅ Changed from bankName
    bankAccount: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    const newErrors = {};
    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else if (Number.parseFloat(formData.amount) < 10) {
      newErrors.amount = "Minimum deposit amount is 10 ETB";
    } else if (Number.parseFloat(formData.amount) > 1000000) {
      newErrors.amount = "Maximum deposit amount is 1,000,000 ETB";
    }

    // ✅ FIXED: Changed bankName to bankCode
    if (!formData.bankCode) {
      newErrors.bankCode = "Please select a bank";
    }

    // Bank account validation
    if (!formData.bankAccount) {
      newErrors.bankAccount = "Bank account number is required";
    } else if (formData.bankAccount.length < 10) {
      newErrors.bankAccount = "Bank account number must be at least 10 digits";
    } else if (!/^\d+$/.test(formData.bankAccount)) {
      newErrors.bankAccount = "Bank account number must contain only digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear success message when user modifies form
    if (success) {
      setSuccess("");
    }
  };

  // ✅ FIXED: Changed to handle bankCode instead of bankName
  const handleBankSelect = (selectedBankValue) => {
    // selectedBankValue could be the bank object, or just the code string, or even the name string.
    // We need to ensure we always get the 'code'.

    let actualBankCode = "";
    if (
      typeof selectedBankValue === "object" &&
      selectedBankValue !== null &&
      selectedBankValue.code
    ) {
      // If it's the full bank object, use its code
      actualBankCode = selectedBankValue.code;
    } else if (typeof selectedBankValue === "string") {
      // If it's a string, it could be either the code or the name.
      // Try to find it in supportedBanks.
      const foundBankByCode = supportedBanks.find(
        (bank) => bank.code === selectedBankValue
      );
      const foundBankByName = supportedBanks.find(
        (bank) => bank.name === selectedBankValue
      );

      if (foundBankByCode) {
        actualBankCode = foundBankByCode.code;
      } else if (foundBankByName) {
        actualBankCode = foundBankByName.code; // This is the key fix for the current issue
      } else {
        // Fallback if not found, or handle error
        console.warn(
          "Selected bank value not found in supported banks:",
          selectedBankValue
        );
        actualBankCode = ""; // Or keep the current value, or set an error
      }
    }

    setFormData((prev) => ({ ...prev, bankCode: actualBankCode }));
    if (errors.bankCode) {
      setErrors((prev) => ({ ...prev, bankCode: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // ✅ FIXED: Add console log to see what's being sent
    console.log("🔍 Deposit form data being sent:", {
      amount: Number.parseFloat(formData.amount),
      bankCode: formData.bankCode,
      bankAccount: formData.bankAccount,
      description: "Stock trading wallet deposit",
    });

    // ✅ FIXED: Call with correct parameters
    const result = await initiateDeposit({
      amount: Number.parseFloat(formData.amount),
      bankCode: formData.bankCode,
      bankAccount: formData.bankAccount,
      description: "Stock trading wallet deposit",
    });

    if (result.success) {
      setSuccess(
        "Deposit initiated successfully! Please check your bank app to complete the transaction."
      );
      setFormData({ amount: "", bankCode: "", bankAccount: "" });
      setErrors({});
    } else {
      setErrors({ submit: result.error || "Failed to initiate deposit" });
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Make a Deposit
        </h3>
        <p className="text-sm text-gray-600">
          Transfer money from your Ethiopian bank account to your trading
          wallet.
        </p>
      </div>
      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Field */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Deposit Amount (ETB)
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
              max="1000000"
              placeholder="0.00"
              className={`block w-full pl-12 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.amount ? "border-red-300" : "border-gray-300"
              }`}
              disabled={depositLoading}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
          {formData.amount && (
            <p className="mt-1 text-sm text-gray-500">
              Amount: ETB {formatCurrency(formData.amount)}
            </p>
          )}
        </div>
        {/* Bank Selector - ✅ FIXED: Updated props */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Your Bank
          </label>
          <BankSelector
            banks={supportedBanks}
            // ✅ Changed from bankName
            selectedBank={formData.bankCode}
            onBankSelect={handleBankSelect}
            // ✅ Changed from bankName
            error={errors.bankCode}
            disabled={depositLoading}
          />
          {/* ✅ Changed from bankName */}
          {errors.bankCode && (
            <p className="mt-1 text-sm text-red-600">{errors.bankCode}</p>
          )}
        </div>
        {/* Bank Account Field */}
        <div>
          <label
            htmlFor="bankAccount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Bank Account Number
          </label>
          <input
            type="text"
            id="bankAccount"
            name="bankAccount"
            value={formData.bankAccount}
            onChange={handleInputChange}
            placeholder="Enter your account number"
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.bankAccount ? "border-red-300" : "border-gray-300"
            }`}
            disabled={depositLoading}
          />
          {errors.bankAccount && (
            <p className="mt-1 text-sm text-red-600">{errors.bankAccount}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Enter the account number you want to transfer from
          </p>

          {/* Add to your form */}
          <div>
            <label
              htmlFor="customerPhone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number (Required)
            </label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              placeholder="+251 912 345678"
              required
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.customerPhone ? "border-red-300" : "border-gray-300"
              }`}
              disabled={depositLoading}
            />
          </div>

          <div>
            <label
              htmlFor="customerEmail"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address (Required)
            </label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.customerEmail ? "border-red-300" : "border-gray-300"
              }`}
              disabled={depositLoading}
            />
          </div>
        </div>
        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {errors.submit}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Technical Errors */}
        {technicalErrors.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">
                  System Notice
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Some technical issues detected. Please try again.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Submit Button */}
        <button
          type="submit"
          disabled={depositLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {depositLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Initiate Deposit"
          )}
        </button>
      </form>
      {/* Information Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">How it works</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Enter the amount you want to deposit</li>
                <li>Select your bank and enter your account number</li>
                <li>Click "Initiate Deposit" to start the process</li>
                <li>
                  You'll receive a notification in your bank app to confirm
                </li>
                <li>Funds will appear in your wallet once confirmed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositForm;
