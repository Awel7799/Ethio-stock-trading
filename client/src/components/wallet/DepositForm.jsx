return (
    <div className="w-full max-w-none">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
            Make a Deposit
          </h3>
        </div>
        <p className="text-gray-600 font-medium">
          Transfer money from your Ethiopian bank account to your trading wallet securely
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-green-900 mb-1">Success!</h4>
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Technical Errors */}
      {technicalErrors.length > 0 && (
        <div className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-amber-900 mb-1">System Notice</h4>
              <p className="text-sm text-amber-800">Some technical issues detected. Please try again.</p>
            </div>
          </div>
        </div>
      )}
      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* Amount Field */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200/50">
              <label htmlFor="amount" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                Deposit Amount (ETB)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-600 font-semibold">ETB</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="10"
                  max="1000000"
                  placeholder="0.00"
                  className={`block w-full pl-16 pr-4 py-4 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white/80 backdrop-blur-sm font-semibold text-lg transition-all ${
                    errors.amount ? "border-red-300" : "border-gray-200 hover:border-amber-300"
                  }`}
                  disabled={depositLoading}
                />
              </div>
              {errors.amount && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.amount}</p>
              )}
              {formData.amount && (
                <div className="mt-3 bg-amber-50 rounded-xl p-3 border border-amber-200">
                  <p className="text-sm text-amber-800 font-semibold">
                    Amount: ETB {formatCurrency(formData.amount)}
                  </p>
                </div>
              )}
            </div>

            {/* Bank Selector */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-200/50 relative z-50">
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
                  <svg className="w-0.8 h-0.8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                Select Your Bank
              </label>
              <BankSelector
                banks={supportedBanks}
                selectedBank={formData.bankCode}
                onBankSelect={handleBankSelect}
                error={errors.bankCode}
                disabled={depositLoading}
              />
              {errors.bankCode && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.bankCode}</p>
              )}
            </div>