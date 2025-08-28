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

  const handleBankSelect = (bankCode) => {
    onBankSelect(bankCode)
    setIsOpen(false)
    setSearchTerm("")
  }

  const selectedBankData = banks.find((bank) => bank.code === selectedBank)

  return (
    <div className="relative">
      {/* Selected Bank Display / Dropdown Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`relative w-full bg-white/80 backdrop-blur-sm border-2 rounded-xl shadow-lg pl-4 pr-12 py-4 text-left cursor-default focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 ${
          error ? "border-red-300 hover:border-red-400" : "border-gray-200 hover:border-amber-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="flex items-center">
          {selectedBankData ? (
            <>
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-white">{selectedBankData.code.charAt(0)}</span>
              </div>
              <div className="ml-4">
                <span className="block font-semibold text-gray-900 text-base">{selectedBankData.name}</span>
                <span className="block text-xs text-gray-600 mt-1">Code: {selectedBankData.code}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="ml-4 block font-medium text-gray-500">Select a bank</span>
            </>
          )}
        </span>
        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg
            className={`h-6 w-6 text-gray-600 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
        <div className="absolute z-max mt-2 w-full bg-white/95 backdrop-blur-md shadow-2xl max-h-80 rounded-2xl border border-gray-200 overflow-hidden">
          
          {/* Search Input */}
          <div className="sticky top-0 bg-gradient-to-r from-amber-50/80 to-yellow-50/60 backdrop-blur-sm p-4 border-b border-amber-200/50">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search banks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white/80 backdrop-blur-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Banks List */}
          <div className="overflow-auto max-h-64">
            {filteredBanks.length > 0 ? (
              filteredBanks.map((bank, index) => (
                <button
                  key={bank.code}
                  type="button"
                  onClick={() => handleBankSelect(bank.code)}
                  className={`w-full text-left px-4 py-4 transition-all duration-200 hover:bg-amber-50/50 focus:outline-none focus:bg-amber-50/50 ${
                    selectedBank === bank.code 
                      ? "bg-gradient-to-r from-amber-100/80 to-yellow-100/60 border-l-4 border-amber-500" 
                      : ""
                  } ${index !== filteredBanks.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                        selectedBank === bank.code 
                          ? "bg-gradient-to-br from-amber-500 to-yellow-600" 
                          : "bg-gradient-to-br from-blue-500 to-indigo-600"
                      }`}
                    >
                      <span className="text-sm font-bold text-white">
                        {bank.code.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`block font-semibold ${
                            selectedBank === bank.code ? "text-amber-900" : "text-gray-900"
                          }`}>
                            {bank.name}
                          </span>
                          <span className={`block text-sm mt-1 ${
                            selectedBank === bank.code ? "text-amber-700" : "text-gray-600"
                          }`}>
                            Code: {bank.code}
                          </span>
                        </div>
                        {selectedBank === bank.code && (
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                            <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-8 px-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {searchTerm ? `No banks found matching "${searchTerm}"` : "No banks available"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}