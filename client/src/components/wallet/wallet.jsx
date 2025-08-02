import { useState, useEffect } from "react"

export default function Wallet() {
  const [activeTab, setActiveTab] = useState("deposit")
  const [selectedBank, setSelectedBank] = useState("")
  const [amount, setAmount] = useState("")
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [showMobileRedirect, setShowMobileRedirect] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState(null)

  // Ethiopian Banks - Simple list
  const ethiopianBanks = {
    cbe: { name: "Commercial Bank of Ethiopia", color: "#1e40af", icon: "🏦" },
    awash: { name: "Awash Bank", color: "#dc2626", icon: "🏛️" },
    dashen: { name: "Dashen Bank", color: "#059669", icon: "🏢" },
    nib: { name: "NIB International Bank", color: "#7c3aed", icon: "🏪" },
    boa: { name: "Bank of Abyssinia", color: "#ea580c", icon: "🏬" },
    wegagen: { name: "Wegagen Bank", color: "#0891b2", icon: "🏦" },
    united: { name: "United Bank", color: "#be123c", icon: "🏛️" }
  }

  // Get user ID (replace with your auth system)
  const userId = "60d5ec49f1b2c8b1f8e4e1a1" // This should come from your auth context

  // Load wallet balance on component mount
  useEffect(() => {
    loadWalletBalance()
    loadTransactionHistory()
    
    // Check for callback from mobile banking
    const urlParams = new URLSearchParams(window.location.search)
    const transactionId = urlParams.get('transaction')
    const status = urlParams.get('status')
    
    if (transactionId && status) {
      handleMobileBankingReturn(transactionId, status)
    }
  }, [])

  // Load wallet balance
  const loadWalletBalance = async () => {
    try {
      const response = await fetch(`/api/wallet/${userId}/balance`)
      const data = await response.json()
      setBalance(data.balance || 0)
    } catch (error) {
      console.error('Failed to load balance:', error)
    }
  }

  // Load transaction history
  const loadTransactionHistory = async () => {
    try {
      const response = await fetch(`/api/wallet/${userId}/transactions`)
      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Failed to load transactions:', error)
    }
  }

  // Handle deposit
  const handleDeposit = async () => {
    if (!selectedBank || !amount) {
      alert("Please select a bank and enter amount")
      return
    }

    if (parseFloat(amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`/api/wallet/${userId}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          bank_code: selectedBank
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setCurrentTransaction(data)
        setShowMobileRedirect(true)
        
        // Try to open mobile banking app
        if (data.mobile_redirect_url) {
          window.location.href = data.mobile_redirect_url
        }
      } else {
        alert(data.error || 'Failed to initiate deposit')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle withdrawal
  const handleWithdrawal = async () => {
    if (!selectedBank || !amount) {
      alert("Please select a bank and enter amount")
      return
    }

    if (parseFloat(amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    if (parseFloat(amount) > balance) {
      alert("Insufficient balance")
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`/api/wallet/${userId}/withdrawal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          bank_code: selectedBank
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setCurrentTransaction(data)
        setShowMobileRedirect(true)
        
        // Try to open mobile banking app
        if (data.mobile_redirect_url) {
          window.location.href = data.mobile_redirect_url
        }
        
        // Update balance immediately (optimistic update)
        setBalance(prev => prev - parseFloat(amount))
      } else {
        alert(data.error || 'Failed to initiate withdrawal')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle return from mobile banking
  const handleMobileBankingReturn = (transactionId, status) => {
    if (status === 'success') {
      alert('Transaction completed successfully!')
      loadWalletBalance()
      loadTransactionHistory()
    } else {
      alert('Transaction was cancelled or failed')
    }
    
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname)
    setShowMobileRedirect(false)
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || statusStyles.failed}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Digital Wallet</h1>

        {/* Balance Display */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <h2 className="text-lg font-medium opacity-90">Available Balance</h2>
          <p className="text-4xl font-bold">{formatCurrency(balance)}</p>
          <p className="text-sm opacity-75 mt-2">Ethiopian Birr (ETB)</p>
        </div>

        {/* Mobile Banking Redirect Modal */}
        {showMobileRedirect && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="text-center">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-2">Complete in Mobile Banking App</h3>
                <p className="text-gray-600 mb-4">
                  We've opened your {currentTransaction?.bank_name} mobile banking app. 
                  Please approve the transaction there.
                </p>
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <p className="font-medium">Amount: {formatCurrency(currentTransaction?.amount)}</p>
                  <p className="text-sm text-gray-600">Transaction ID: {currentTransaction?.transaction_id}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowMobileRedirect(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  {currentTransaction?.web_redirect_url && (
                    <a
                      href={currentTransaction.web_redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
                    >
                      Open Web 🔗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {['deposit', 'withdraw', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Deposit Tab */}
        {activeTab === 'deposit' && (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-3">
                Select Your Bank
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(ethiopianBanks).map(([code, bank]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedBank(code)}
                    className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                      selectedBank === code
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{bank.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{bank.name}</p>
                        <p className="text-sm text-gray-500">Instant transfer</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="depositAmount" className="block text-lg font-medium text-gray-800 mb-2">
                Amount (ETB)
              </label>
              <input
                type="number"
                id="depositAmount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                min="1"
                step="0.01"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 text-2xl">📱</span>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">How it works:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Select your bank and enter amount</li>
                    <li>We'll open your mobile banking app</li>
                    <li>Approve the payment in your app</li>
                    <li>Money will be added to your wallet instantly</li>
                  </ol>
                </div>
              </div>
            </div>

            <button
              onClick={handleDeposit}
              disabled={loading || !selectedBank || !amount}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Deposit Money'}
            </button>
          </div>
        )}

        {/* Withdraw Tab */}
        {activeTab === 'withdraw' && (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-3">
                Select Your Bank
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(ethiopianBanks).map(([code, bank]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedBank(code)}
                    className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                      selectedBank === code
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{bank.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{bank.name}</p>
                        <p className="text-sm text-gray-500">Instant transfer</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="withdrawAmount" className="block text-lg font-medium text-gray-800 mb-2">
                Amount (ETB)
              </label>
              <input
                type="number"
                id="withdrawAmount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-lg"
                min="1"
                max={balance}
                step="0.01"
              />
              <p className="text-sm text-gray-500 mt-1">
                Available balance: {formatCurrency(balance)}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-green-500 text-2xl">🏦</span>
                <div className="text-sm text-green-800">
                  <p className="font-medium">Withdrawal process:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Select your bank and enter amount</li>
                    <li>Confirm withdrawal in your mobile banking app</li>
                    <li>Money will be transferred to your bank account</li>
                    <li>You'll receive a confirmation notification</li>
                  </ol>
                </div>
              </div>
            </div>

            <button
              onClick={handleWithdrawal}
              disabled={loading || !selectedBank || !amount || parseFloat(amount) > balance}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Withdraw Money'}
            </button>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-800">Transaction History</h2>
              <button
                onClick={loadTransactionHistory}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Refresh
              </button>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4 text-6xl">🏦</div>
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-sm text-gray-400">Your deposit and withdrawal history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          transaction.status === 'completed' ? 'bg-green-500' :
                          transaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className={`w-3 h-3 rounded-full ${
                          transaction.type === 'deposit' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {transaction.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.bank_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}