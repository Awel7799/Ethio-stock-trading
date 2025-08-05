import React, { useState, useEffect } from "react";
import TransactionHistory from "./TransactionHistory";
import BankSelector from "./BankSelector";
import DepositForm from "./DepositForm";
import WithdrawForm from "./WithdrawForm";
import { fetchBalance, getWalletSummary } from "../../services/walletApi";

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("deposit");
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  // Fetch wallet data on component mount
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        setIsLoading(true);
        const balance = await fetchBalance();
        const summaryResponse = await getWalletSummary();
        setBalance(balance);
        setSummary(summaryResponse);
      } catch (err) {
        setError("Failed to load wallet data. Please try again later.");
        console.error("Wallet data error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWalletData();
  }, []);

  // Handle transaction completion
  const handleTransactionSuccess = (newBalance) => {
    setBalance(newBalance);
    // Refresh summary
    getWalletSummary().then(data => setSummary(data));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Wallet Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">My Wallet</h1>
            <p className="text-gray-600">Manage your funds and transactions</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600">Available Balance</p>
            <p className="text-3xl font-bold text-green-600">
              {balance.toLocaleString('en-ET')} ETB
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b mb-6">
        <button
          className={`px-4 py-3 font-medium whitespace-nowrap ${
            activeTab === "deposit"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("deposit")}
        >
          <i className="fas fa-money-bill-wave mr-2"></i>
          Deposit Funds
        </button>
        <button
          className={`px-4 py-3 font-medium whitespace-nowrap ${
            activeTab === "withdraw"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("withdraw")}
        >
          <i className="fas fa-hand-holding-usd mr-2"></i>
          Withdraw Funds
        </button>
        <button
          className={`px-4 py-3 font-medium whitespace-nowrap ${
            activeTab === "history"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("history")}
        >
          <i className="fas fa-history mr-2"></i>
          Transaction History
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {activeTab === "deposit" && (
          <DepositForm 
            onSuccess={handleTransactionSuccess} 
            onDepositInitiated={(info) => {
              console.log("Deposit initiated:", info);
              // In a real app, you'd show a modal with USSD code
              // or redirect to banking app
            }}
          />
        )}
        
        {activeTab === "withdraw" && (
          <WithdrawForm 
            balance={balance} 
            onSuccess={handleTransactionSuccess}
            onWithdrawalInitiated={(info) => {
              console.log("Withdrawal initiated:", info);
              setBalance(info.newBalance || balance - info.amount);
            }}
          />
        )}
        
        {activeTab === "history" && <TransactionHistory />}
      </div>

      {/* Quick Stats Summary */}
      {summary && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Deposits</p>
            <p className="text-xl font-semibold">
              {summary.total_deposits?.toLocaleString() || '0'} ETB
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Withdrawals</p>
            <p className="text-xl font-semibold">
              {summary.total_withdrawals?.toLocaleString() || '0'} ETB
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-xl font-semibold">
              {summary.success_rate || '0'}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}