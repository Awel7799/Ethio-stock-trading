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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Wallet Dashboard</h1>
            <p className="text-lg text-gray-600">Manage your funds with ease and security</p>
          </div>

          {/* Technical Errors Display */}
          {technicalErrors.length > 0 && (
            <div className="bg-white border-l-4 border-red-500 rounded-xl shadow-lg p-6 backdrop-blur-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-bold text-red-900 mb-3">Technical Issues Detected</h3>
                  <div className="space-y-2">
                    {technicalErrors.slice(0, 3).map((error) => (
                      <p key={error.id} className="text-red-800 text-sm font-medium">• {error.message}</p>
                    ))}
                  </div>
                  <button
                    onClick={clearErrors}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Balance Overview Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-8 py-8 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-white text-xl font-semibold mb-3 opacity-90">Available Balance</h2>
                  <div className="flex items-center space-x-4">
                    {balanceLoading ? (
                      <div className="animate-pulse">
                        <div className="h-14 bg-white/20 rounded-lg w-64 shadow-inner"></div>
                      </div>
                    ) : (
                      <p className="text-5xl font-bold text-white drop-shadow-lg">
                        {formatCurrency(balance)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleRefresh}
                    disabled={balanceLoading}
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 disabled:opacity-50 flex items-center shadow-lg transform hover:scale-105"
                  >
                    <svg className={`w-5 h-5 mr-2 ${balanceLoading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Pending Transactions Alert */}
            {pendingTransactions.length > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-6 m-6 rounded-xl shadow-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                      <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-amber-900">
                      Pending Transactions
                    </h3>
                    <p className="text-amber-800 font-medium">
                      You have {pendingTransactions.length} transaction{pendingTransactions.length > 1 ? 's' : ''} being processed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-2xl">
              <nav className="flex justify-center space-x-2 p-4" aria-label="Tabs">
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
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border border-blue-500/50'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-transparent'
                    } px-6 py-4 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-md backdrop-blur-sm`}
                  >
                    {tab.icon === 'chart' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                    {tab.icon === 'plus' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                    {tab.icon === 'minus' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    )}
                    {tab.icon === 'history' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-blue-800 font-bold text-sm">Available Balance</p>
                          <p className="text-2xl font-bold text-blue-900">{formatCurrency(balance)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-emerald-800 font-bold text-sm">Ready to Deposit</p>
                          <p className="text-lg font-bold text-emerald-900">Ethiopian Banks</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 border border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-orange-800 font-bold text-sm">Pending</p>
                          <p className="text-lg font-bold text-orange-900">{pendingTransactions.length} Transaction{pendingTransactions.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Transaction Status */}
                  <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-lg backdrop-blur-sm">
                    <TransactionStatus />
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      onClick={() => setActiveTab('deposit')}
                      className="group bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-dashed border-blue-300 rounded-2xl p-10 text-blue-700 hover:border-blue-400 hover:from-blue-100 hover:to-indigo-200 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                    >
                      <div className="flex items-center justify-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <span className="text-xl font-bold">Make a Deposit</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('withdraw')}
                      className="group bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-dashed border-emerald-300 rounded-2xl p-10 text-emerald-700 hover:border-emerald-400 hover:from-emerald-100 hover:to-green-200 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                    >
                      <div className="flex items-center justify-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                          </svg>
                        </div>
                        <span className="text-xl font-bold">Make a Withdrawal</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'deposit' && (
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-lg backdrop-blur-sm">
                  <DepositForm />
                </div>
              )}
              
              {activeTab === 'withdraw' && (
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-lg backdrop-blur-sm">
                  <WithdrawForm />
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-lg backdrop-blur-sm">
                  <TransactionHistory />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallett;