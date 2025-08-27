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
