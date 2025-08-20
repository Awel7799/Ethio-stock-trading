// frontend/src/components/wallet/TransactionStatus.jsx
import React from 'react';
import { useWallet } from '../../context/WalletContext';

const TransactionStatus = () => {
  const { pendingTransactions, transactions } = useWallet();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    }).format(amount).replace('ETB', 'ETB');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecentCompletedTransactions = () => {
    return transactions
      .filter(t => t.status === 'completed')
      .slice(0, 3)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  };

  const recentCompleted = getRecentCompletedTransactions();

  if (pendingTransactions.length === 0 && recentCompleted.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Pending Transactions */}
      {pendingTransactions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h4 className="text-sm font-medium text-yellow-800">
              Processing Transactions ({pendingTransactions.length})
            </h4>
          </div>
          
          <div className="space-y-2">
            {pendingTransactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between bg-white rounded-md p-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {transaction.type === 'deposit' ? (
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {transaction.type} • {transaction.bank_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Started at {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                  <div className="flex items-center">
                    <svg className="animate-spin h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 text-xs text-yellow-700">
            <p>• These transactions are being processed automatically</p>
            <p>• Status updates every 5 seconds</p>
            <p>• You'll be notified when complete</p>
          </div>
        </div>
      )}

      {/* Recent Completed Transactions */}
      {recentCompleted.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h4 className="text-sm font-medium text-green-800">
              Recent Completed Transactions
            </h4>
          </div>
          
          <div className="space-y-2">
            {recentCompleted.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between bg-white rounded-md p-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {transaction.type === 'deposit' ? (
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {transaction.type} • {transaction.bank_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Completed at {formatDate(transaction.updated_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Done
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Activity State */}
      {pendingTransactions.length === 0 && recentCompleted.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <svg className="mx-auto h-8 w-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h4 className="text-sm font-medium text-gray-900 mb-1">No Recent Activity</h4>
          <p className="text-xs text-gray-500">
            Your recent transactions will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;