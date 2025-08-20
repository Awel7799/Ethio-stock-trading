"use client"

import { useState } from "react"

export default function BankSelector({ banks, selectedBank, onBankSelect, error, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBanks = banks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Changed parameter name to bankCode for clarity, and pass bankCode to onBankSelect
  const handleBankSelect = (bankCode) => {
    onBankSelect(bankCode)
    setIsOpen(false)
    setSearchTerm("")
  }

  // Changed lookup to use bank.code instead of bank.name
  const selectedBankData = banks.find((bank) => bank.code === selectedBank)

  return (
    <div className="relative">
      {/* Selected Bank Display / Dropdown Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`relative w-full bg-white border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
          error ? "border-red-300" : "border-gray-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-400"}`}
      >
        <span className="flex items-center">
          {selectedBankData ? (
            <>
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">{selectedBankData.code.charAt(0)}</span>
              </div>
              <span className="ml-3 block truncate">{selectedBankData.name}</span>
            </>
          ) : (
            <span className="block truncate text-gray-500">Select a bank</span>
          )}
        </span>
        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className={`h-5 w-5 text-gray-400 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>
      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {/* Search Input */}
          <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search banks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Banks List */}
          {filteredBanks.length > 0 ? (
            filteredBanks.map((bank) => (
              <button
                key={bank.code}
                type="button"
                // CRITICAL FIX: Pass bank.code instead of bank.name
                onClick={() => handleBankSelect(bank.code)}
                className={`${
                  // CRITICAL FIX: Compare selectedBank with bank.code for styling
                  selectedBank === bank.code ? "bg-blue-100 text-blue-900" : "text-gray-900"
                } cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 w-full text-left`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      // CRITICAL FIX: Compare selectedBank with bank.code for styling
                      selectedBank === bank.code ? "bg-blue-200" : "bg-gray-100"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        // CRITICAL FIX: Compare selectedBank with bank.code for styling
                        selectedBank === bank.code ? "text-blue-700" : "text-gray-600"
                      }`}
                    >
                      {bank.code.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <span
                      className={`block truncate ${
                        // CRITICAL FIX: Compare selectedBank with bank.code for styling
                        selectedBank === bank.code ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {bank.name}
                    </span>
                    <span className="block text-xs text-gray-500 truncate">{bank.code}</span>
                  </div>
                </div>
                {/* CRITICAL FIX: Compare selectedBank with bank.code for checkmark display */}
                {selectedBank === bank.code && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="py-3 px-3 text-sm text-gray-500 text-center">
              {searchTerm ? `No banks found matching "${searchTerm}"` : "No banks available"}
            </div>
          )}
        </div>
      )}
      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
