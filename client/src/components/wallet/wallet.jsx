 return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-25 to-orange-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-orange-400 to-amber-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-6">
          
          {/* Compact Header */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-black bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-800 bg-clip-text text-transparent tracking-tight">
              Wallet Dashboard
            </h1>
            <p className="text-gray-600 font-medium text-sm">Manage your finances with elegance and control</p>
          </div>
          {/* Technical Errors - Compact */}
          {technicalErrors.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm border-l-4 border-red-500 rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900 text-sm">Technical Issues ({technicalErrors.length})</h3>
                    <p className="text-red-700 text-xs">{technicalErrors[0]?.message}</p>
                  </div>
                </div>
                <button
                  onClick={clearErrors}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
{/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Balance Card */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-200/50 overflow-hidden">
                
                {/* Balance Section */}
                <div className="relative p-8">
                  {/* Subtle Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-300/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-xl flex items-center justify-center shadow-md">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Available Balance</h2>
                      </div>
                      
                      {balanceLoading ? (
                        <div className="animate-pulse bg-gray-200 h-12 w-64 rounded-xl"></div>
                      ) : (
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-amber-100">
                          <p className="text-4xl font-black bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                            {formatCurrency(balance)}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={handleRefresh}
                      disabled={balanceLoading}
                      className="bg-white/80 hover:bg-white text-gray-800 px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md border border-gray-200 disabled:opacity-50 flex items-center"
                    >
                      <svg className={`w-4 h-4 mr-2 ${balanceLoading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Pending Alert */}
                {pendingTransactions.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-100 to-amber-100 border-t border-orange-200/50 px-8 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-orange-900 text-sm">Pending Transactions</h3>
                        <p className="text-orange-800 text-xs">{pendingTransactions.length} items being processed</p>
                      </div>
                      <div className="ml-auto bg-orange-200 text-orange-800 px-3 py-1 rounded-full font-bold text-sm">
                        {pendingTransactions.length}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>