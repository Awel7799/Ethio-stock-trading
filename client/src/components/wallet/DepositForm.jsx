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
            {/* Bank Account Field */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200/50">
              <label htmlFor="bankAccount" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Your Bank Account Number
              </label>
              <input
                type="text"
                id="bankAccount"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleInputChange}
                placeholder="Enter your account number"
                className={`block w-full px-4 py-4 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white/80 backdrop-blur-sm font-semibold transition-all ${
                  errors.bankAccount ? "border-red-300" : "border-gray-200 hover:border-amber-300"
                }`}
                disabled={depositLoading}
              />
              {errors.bankAccount && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.bankAccount}</p>
              )}
              <p className="mt-2 text-xs text-gray-600 font-medium">
                Enter the account number you want to transfer from
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Phone Number Field */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200/50">
              <label htmlFor="customerPhone" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                Phone Number (Required)
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="+251 912 345678"
                required
                className={`block w-full px-4 py-4 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white/80 backdrop-blur-sm font-semibold transition-all ${
                  errors.customerPhone ? "border-red-300" : "border-gray-200 hover:border-amber-300"
                }`}
                disabled={depositLoading}
              />
              {errors.customerPhone && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.customerPhone}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200/50">
              <label htmlFor="customerEmail" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                Email Address (Required)
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
                className={`block w-full px-4 py-4 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white/80 backdrop-blur-sm font-semibold transition-all ${
                  errors.customerEmail ? "border-red-300" : "border-gray-200 hover:border-amber-300"
                }`}
                disabled={depositLoading}
              />
              {errors.customerEmail && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.customerEmail}</p>
              )}
            </div>
             {/* Information Box */}
            <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-900 mb-2">How it works</h4>
                  <ul className="text-xs text-blue-800 space-y-1 font-medium">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-1">•</span>
                      Enter the amount you want to deposit
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-1">•</span>
                      Select your bank and enter your account details
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-1">•</span>
                      Click "Initiate Deposit" to start the process
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-1">•</span>
                      You'll receive a notification in your bank app to confirm
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-1">•</span>
                      Funds will appear in your wallet once confirmed
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
