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