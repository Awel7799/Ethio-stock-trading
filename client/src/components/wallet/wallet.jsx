"use client"

import { useState } from "react"

export default function Wallet() {
  const [activeTab, setActiveTab] = useState("deposit") // 'deposit', 'withdraw', 'history'
  const [paymentMethod, setPaymentMethod] = useState("")
  const [amount, setAmount] = useState("")
  const [totalBalance, setTotalBalance] = useState(5000.0) // Initial dummy balance

  // Mapping for payment method display names
  const paymentMethodDisplayNames = {
    bank: "Bank Account (International)",
    card: "Credit/Debit Card",
    paypal: "PayPal",
    cbe: "Commercial Bank of Ethiopia",
    awash: "Awash Bank",
    dashen: "Dashen Bank",
    nib: "NIB International Bank",
    boa: "Bank of Abyssinia",
  }

  // Dummy data for transaction history
  const [historyData, setHistoryData] = useState([
    {
      date: "2024-07-15",
      type: "Deposit",
      method: "cbe", // Storing the value, not the display name
      amount: 5000.0,
      status: "Completed",
    },
    {
      date: "2024-07-14",
      type: "Withdrawal",
      method: "card",
      amount: 1500.0,
      status: "Completed",
    },
    {
      date: "2024-07-12",
      type: "Deposit",
      method: "paypal",
      amount: 200.0,
      status: "Completed",
    },
    {
      date: "2024-07-10",
      type: "Withdrawal",
      method: "awash",
      amount: 3000.0,
      status: "Pending",
    },
    {
      date: "2024-07-08",
      type: "Deposit",
      method: "bank",
      amount: 10000.0,
      status: "Completed",
    },
  ])

  // Function to handle tab changes and clear form fields
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPaymentMethod("") // Clear payment method
    setAmount("") // Clear amount
  }

  const handleDeposit = (e) => {
    e.preventDefault()
    if (!paymentMethod || !amount) {
      alert("Please select a payment method and enter an amount.")
      return
    }
    const depositAmount = Number.parseFloat(amount)
    if (isNaN(depositAmount) || depositAmount <= 0) {
      alert("Please enter a valid positive amount.")
      return
    }

    const newTransaction = {
      date: new Date().toISOString().slice(0, 10),
      type: "Deposit",
      method: paymentMethod,
      amount: depositAmount,
      status: "Completed", // Simulate completion for demo
    }
    setHistoryData([newTransaction, ...historyData]) // Add new transaction to history
    setTotalBalance((prevBalance) => Number.parseFloat((prevBalance + depositAmount).toFixed(2))) // Update balance by adding the full deposit amount
    console.log("Deposit initiated:", { paymentMethod, amount })
    alert(
      `Depositing ${depositAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })} via ${paymentMethodDisplayNames[paymentMethod] || paymentMethod}. (Demo)`,
    )
    // Reset form
    setPaymentMethod("")
    setAmount("")
  }

  const handleWithdraw = (e) => {
    e.preventDefault()
    if (!paymentMethod || !amount) {
      alert("Please select a payment method and enter an amount.")
      return
    }
    const withdrawAmount = Number.parseFloat(amount)
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert("Please enter a valid positive amount.")
      return
    }
    if (withdrawAmount > totalBalance) {
      alert("Insufficient balance for this withdrawal.")
      return
    }

    const newTransaction = {
      date: new Date().toISOString().slice(0, 10),
      type: "Withdrawal",
      method: paymentMethod,
      amount: withdrawAmount,
      status: "Pending", // Simulate pending for withdrawal
    }
    setHistoryData([newTransaction, ...historyData]) // Add new transaction to history
    setTotalBalance((prevBalance) => Number.parseFloat((prevBalance - withdrawAmount).toFixed(2))) // Update balance
    console.log("Withdrawal initiated:", { paymentMethod, amount })
    alert(
      `Withdrawing ${withdrawAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })} to ${paymentMethodDisplayNames[paymentMethod] || paymentMethod}. (Demo)`,
    )
    // Reset form
    setPaymentMethod("")
    setAmount("")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Wallet</h1>

        {/* Total Balance Display */}
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h2 className="text-lg font-semibold text-gray-700">Current Balance</h2>
          <p className="text-4xl font-bold text-purple-700">
            {totalBalance.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => handleTabChange("deposit")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "deposit"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => handleTabChange("withdraw")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "withdraw"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Withdraw
          </button>
          <button
            onClick={() => handleTabChange("history")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "history"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            History
          </button>
        </div>

        {/* Deposit Tab Content */}
        {activeTab === "deposit" && (
          <form onSubmit={handleDeposit} className="space-y-6">
            <div>
              <label htmlFor="depositPaymentMethod" className="block text-lg font-semibold text-gray-800 mb-2">
                Payment Method
              </label>
              <select
                id="depositPaymentMethod"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 appearance-none bg-white pr-8"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%238B5CF6' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg>')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.5em 1.5em",
                }}
              >
                <option value="">Select</option>
                <optgroup label="International">
                  <option value="bank">Bank Account</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="paypal">PayPal</option>
                </optgroup>
                <optgroup label="Ethiopian Banks">
                  <option value="cbe">Commercial Bank of Ethiopia</option>
                  <option value="awash">Awash Bank</option>
                  <option value="dashen">Dashen Bank</option>
                  <option value="nib">NIB International Bank</option>
                  <option value="boa">Bank of Abyssinia</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label htmlFor="depositAmount" className="block text-lg font-semibold text-gray-800 mb-2">
                Amount
              </label>
              <input
                type="number"
                id="depositAmount"
                name="amount"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300"
              >
                Deposit
              </button>
            </div>
          </form>
        )}

        {/* Withdraw Tab Content */}
        {activeTab === "withdraw" && (
          <form onSubmit={handleWithdraw} className="space-y-6">
            <div>
              <label htmlFor="withdrawPaymentMethod" className="block text-lg font-semibold text-gray-800 mb-2">
                Payment Method
              </label>
              <select
                id="withdrawPaymentMethod"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 appearance-none bg-white pr-8"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%238B5CF6' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg>')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.5em 1.5em",
                }}
              >
                <option value="">Select</option>
                <optgroup label="International">
                  <option value="bank">Bank Account</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="paypal">PayPal</option>
                </optgroup>
                <optgroup label="Ethiopian Banks">
                  <option value="cbe">Commercial Bank of Ethiopia</option>
                  <option value="awash">Awash Bank</option>
                  <option value="dashen">Dashen Bank</option>
                  <option value="nib">NIB International Bank</option>
                  <option value="boa">Bank of Abyssinia</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label htmlFor="withdrawAmount" className="block text-lg font-semibold text-gray-800 mb-2">
                Amount
              </label>
              <input
                type="number"
                id="withdrawAmount"
                name="amount"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300"
              >
                Withdraw
              </button>
            </div>
          </form>
        )}

        {/* History Tab Content */}
        {activeTab === "history" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h2>
            <div className="overflow-x-auto border border-gray-200 shadow-md rounded-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3 border-b border-gray-200">Date</th>
                    <th className="px-6 py-3 border-b border-gray-200">Type</th>
                    <th className="px-6 py-3 border-b border-gray-200">Method</th>
                    <th className="px-6 py-3 border-b border-gray-200">Amount</th>
                    <th className="px-6 py-3 border-b border-gray-200">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {historyData.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paymentMethodDisplayNames[transaction.method] || transaction.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          transaction.status === "Completed" ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {transaction.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
