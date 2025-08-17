// frontend/src/components/wallet/TransactionHistory.jsx
import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';

const TransactionHistory = () => {
  const {
    transactions,
    transactionsLoading,
    pendingTransactions,
    refreshTransactions
  } = useWallet();

  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'deposit', 'withdraw'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', 'pending', 'failed'

  useEffect(() => {
    let filtered = [...transactions];

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        filtered = filtered.filter(t => t.status === 'initiated' || t.status === 'pending');
      } else {
        filtered = filtered.filter(t => t.status === statusFilter);
      }
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredTransactions(filtered);
  }, [transactions, filter, statusFilter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    }).format(amount).replace('ETB', 'ETB');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Completed'
      },
      initiated: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Initiated'
      },
      pending: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Processing'
      },
      failed: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Failed'
      }
    };

    const config = statusConfig[status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: status
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status === 'initiated' || status === 'pending' ? (
          <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {config.label}
      </span>
    );
  };

  const getTransactionIcon = (type, status) => {
    if (type === 'deposit') {
      return (
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
        }`}>
          <svg className={`w-4 h-4 ${status === 'completed' ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          status === 'completed' ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <svg className={`w-4 h-4 ${status === 'completed' ? 'text-blue-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </div>
      );
    }
  };

  if (transactionsLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-4 p-4">
              <div className="rounded-full bg-gray-200 h-8 w-8"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
        <button
          onClick={refreshTransactions}
          disabled={transactionsLoading}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <svg className={`-ml-1 mr-2 h-4 w-4 ${transactionsLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Type:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All</option>
            <option value="deposit">Deposits</option>
            <option value="withdraw">Withdrawals</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Pending Transactions Alert */}
      {pendingTransactions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {pendingTransactions.length} Transaction{pendingTransactions.length > 1 ? 's' : ''} Processing
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                These transactions are being processed and will update automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' && statusFilter === 'all' 
              ? "You haven't made any transactions yet."
              : "No transactions match your current filters."
            }
          </p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div key={transaction._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  {getTransactionIcon(transaction.type, transaction.status)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {transaction.type} {transaction.type === 'deposit' ? 'from' : 'to'} {transaction.bank_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.description || `${transaction.type === 'deposit' ? 'Deposit from' : 'Withdrawal to'} ${transaction.bank_name}`}
                        </p>
                        {transaction.bank_account && (
                          <p className="text-xs text-gray-400">
                            Account: ****{transaction.bank_account.slice(-4)}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm font-medium ${
                            transaction.type === 'deposit' ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(transaction.created_at)}
                        </p>
                        {transaction.ethswitch_transaction_id && (
                          <p className="text-xs text-gray-400 mt-1">
                            ID: {transaction.ethswitch_transaction_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;