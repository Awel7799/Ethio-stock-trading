// frontend/src/components/wallet/Wallet.jsx
import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import DepositForm from './DepositForm';
import WithdrawForm from './WithdrawForm';
import TransactionHistory from './TransactionHistory';
import TransactionStatus from './TransactionStatus';

const Wallett = () => {
  const {
    balance,
    balanceLoading,
    pendingTransactions,
    refreshBalance,
    technicalErrors,
    clearErrors
  } = useWallet();

  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    }).format(amount).replace('ETB', 'ETB');
  };

  const handleRefresh = () => {
    refreshBalance();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <div className="space-y-6">
        {/* Technical Errors Display */}
        {technicalErrors.length > 0 && (
          <div className="bg-white border-l-4 border-red-500 rounded-lg shadow-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Issues Detected</h3>
                <div className="space-y-1">
                  {technicalErrors.slice(0, 3).map((error) => (
                    <p key={error.id} className="text-gray-700 text-sm">• {error.message}</p>
                  ))}
                </div>
                <button
                  onClick={clearErrors}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Balance Overview Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white text-lg font-medium mb-1 opacity-90">Available Balance</h2>
                <div className="flex items-center space-x-4">
                  {balanceLoading ? (
                    <div className="animate-pulse">
                      <div className="h-10 bg-white/20 rounded w-48"></div>
                    </div>
                  ) : (
                    <p className="text-4xl font-bold text-white drop-shadow-sm">
                      {formatCurrency(balance)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={balanceLoading}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-white/20 disabled:opacity-50 flex items-center"
                >
                  <svg className={`w-4 h-4 mr-2 ${balanceLoading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Pending Transactions Alert */}
          {pendingTransactions.length > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 m-6 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-amber-800">
                    Pending Transactions
                  </h3>
                  <p className="text-amber-700 text-sm">
                    You have {pendingTransactions.length} transaction{pendingTransactions.length > 1 ? 's' : ''} being processed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="border-b border-gray-200 bg-gray-50/50 rounded-t-xl">
            <nav className="flex justify-center space-x-1 p-1" aria-label="Tabs">
              {[
                { id: 'overview', name: 'Overview', icon: 'chart' },
                { id: 'deposit', name: 'Deposit', icon: 'plus' },
                { id: 'withdraw', name: 'Withdraw', icon: 'minus' },
                { id: 'history', name: 'Transaction History', icon: 'history' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  } px-4 py-3 rounded-lg font-medium text-sm flex items-center space-x-2 transition-all duration-200 m-1`}
                >
                  {tab.icon === 'chart' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {tab.icon === 'plus' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                  {tab.icon === 'minus' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  )}
                  {tab.icon === 'history' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-blue-700 font-medium text-sm">Available Balance</p>
                        <p className="text-xl font-bold text-blue-900">{formatCurrency(balance)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-green-700 font-medium text-sm">Ready to Deposit</p>
                        <p className="text-lg font-bold text-green-900">Ethiopian Banks</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-orange-700 font-medium text-sm">Pending</p>
                        <p className="text-lg font-bold text-orange-900">{pendingTransactions.length} Transaction{pendingTransactions.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Transaction Status */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <TransactionStatus />
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => setActiveTab('deposit')}
                    className="group bg-white border-2 border-dashed border-blue-300 rounded-xl p-8 text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-200">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <span className="text-lg font-semibold">Make a Deposit</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('withdraw')}
                    className="group bg-white border-2 border-dashed border-green-300 rounded-xl p-8 text-green-600 hover:border-green-400 hover:bg-green-50/50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-center">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-200">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                      </div>
                      <span className="text-lg font-semibold">Make a Withdrawal</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'deposit' && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <DepositForm />
              </div>
            )}
            
            {activeTab === 'withdraw' && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <WithdrawForm />
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <TransactionHistory />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallett;