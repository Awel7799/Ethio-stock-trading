"use client"

import { useState, useEffect } from "react"
import PerformanceChart from "./PerformanceChart"
import HoldingsCard from "../market/holdingCards"

// Dummy data for holdings
const holdingsData = [
  { stock: "TechCorp", quantity: 10, value: 1000.0, profitLoss: 100.0 },
  { stock: "HealthInc", quantity: 5, value: 500.0, profitLoss: -50.0 },
  { stock: "FinServ", quantity: 20, value: 2000.0, profitLoss: 200.0 },
  { stock: "RetailCo", quantity: 15, value: 1500.0, profitLoss: -150.0 },
  { stock: "EnergyLtd", quantity: 8, value: 800.0, profitLoss: 80.0 },
]

// Dummy data for recent transactions
const transactionsData = [
  {
    date: "2024-03-15",
    type: "Buy",
    stock: "TechCorp",
    quantity: 5,
    amount: 500.0,
  },
  {
    date: "2024-03-10",
    type: "Sell",
    stock: "HealthInc",
    quantity: 2,
    amount: 200.0,
  },
  {
    date: "2024-03-05",
    type: "Buy",
    stock: "FinServ",
    quantity: 10,
    amount: 1000.0,
  },
  {
    date: "2024-02-28",
    type: "Sell",
    stock: "RetailCo",
    quantity: 8,
    amount: 800.0,
  },
]

const Portfolio = () => {
  const initialBalanceValue = 12345.67 // Starting numerical balance
  const [currentBalance, setCurrentBalance] = useState(initialBalanceValue)
  const [dailyChangePercentage, setDailyChangePercentage] = useState(0) // Initial change percentage
  const [dailyChangeAmount, setDailyChangeAmount] = useState(0) // Initial change amount

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a random percentage change between -0.5% and +0.5%
      const randomPercentChange = Math.random() * 1 - 0.5 // e.g., -0.5 to 0.5
      setDailyChangePercentage(randomPercentChange)

      setCurrentBalance((prevBalance) => {
        const newBalance = prevBalance * (1 + randomPercentChange / 100)
        const calculatedChangeAmount = newBalance - prevBalance // Calculate the actual dollar change
        setDailyChangeAmount(calculatedChangeAmount)
        return Number.parseFloat(newBalance.toFixed(2))
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, []) // Empty dependency array to run once on mount

  const formattedBalance = currentBalance.toLocaleString("en-US", { style: "currency", currency: "USD" })
  const formattedChangeAmount = dailyChangeAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })
  const formattedChangePercentage = `${dailyChangePercentage >= 0 ? "+" : ""}${dailyChangePercentage.toFixed(2)}%`

  const isPositiveChange = dailyChangePercentage >= 0

  return (
    <div className="min-h-screen bg-gray-50 p-8 ">
      {/* Changed w-[100%] to w-full for clarity, functionally same */}
      <div className="mx-auto bg-white rounded-lg shadow-md p-6 w-full">
        {/* Top Section: Total Balance (Left) and Holdings Card (Right) */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Total Balance Section */}
          <div className="flex-shrink-0 w-full md:w-1/2">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Total Balance</h2>
            <div className="flex flex-col items-start">
              <p className={`text-4xl font-bold ${isPositiveChange ? "text-green-600" : "text-red-600"} mb-1`}>
                {formattedBalance}
              </p>
              <p className={`text-sm font-medium ${isPositiveChange ? "text-green-500" : "text-red-500"}`}>
                {dailyChangeAmount >= 0 ? "+" : ""}
                {formattedChangeAmount} ({formattedChangePercentage})
              </p>
            </div>
          </div>

          {/* Holdings Component - Right */}
          <div className="flex-grow w-fit md:w-1/2">
            <HoldingsCard holdingsData={holdingsData} />
          </div>
        </div>

        {/* Performance Chart */}
        <div className="shadow-lg h-[60vh] border-gray-300 rounded-lg p-4 bg-white mb-8 w-full">
          <PerformanceChart />
        </div>

        {/* Recent Transactions Table */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto border border-gray-200 shadow-md rounded-lg">
            {" "}
            {/* Added border and shadow here */}
            <table className="min-w-full bg-white">
              {" "}
              {/* Removed border-gray-200 and rounded-lg from table, now on wrapper */}
              <thead>
                <tr className="bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3 border-b border-gray-200">Date</th>
                  <th className="px-6 py-3 border-b border-gray-200">Type</th>
                  <th className="px-6 py-3 border-b border-gray-200">Stock</th>
                  <th className="px-6 py-3 border-b border-gray-200">Quantity</th>
                  <th className="px-6 py-3 border-b border-gray-200">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactionsData.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio
