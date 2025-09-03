import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Import the real useAuth hook

function Security() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Use the real logout function from AuthContext
  const { logout } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    alert("Security settings updated");
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      setIsLoggingOut(true);
      try {
        await logout();
        // No need to set isLoggingOut back to false - user will be redirected
      } catch (error) {
        console.error("Logout failed:", error);
        setIsLoggingOut(false);
        // Optionally show error to user
        setError("Logout failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-200/30 to-amber-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className=" w-[85%] bg-white/95 backdrop-blur-lg p-4 sm:p-6 md:p-8 shadow-2xl rounded-3xl border border-amber-100/50 relative z-10 transform hover:scale-[1.01] transition-transform duration-500">
        {/* Enhanced header with icon */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl shadow-lg mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Security Settings
          </h2>
          <p className="text-gray-600 text-sm mt-2">Manage your account security and preferences</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Password */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              New Password
            </label>
            <div className="relative">
              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${focusedField === "password" || password ? "scale-110 text-amber-500" : "text-gray-400"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                type="password"
                placeholder="Set password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white placeholder-gray-500 text-sm sm:text-base group-hover:shadow-md"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Confirm Password
            </label>
            <div className="relative">
              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${focusedField === "confirm" || confirm ? "scale-110 text-amber-500" : "text-gray-400"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onFocus={() => setFocusedField("confirm")}
                onBlur={() => setFocusedField("")}
                className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white placeholder-gray-500 text-sm sm:text-base group-hover:shadow-md"
              />
            </div>
          </div>

          {/* 2FA Authentication */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              2FA Authentication Code
            </label>
            <div className="relative">
              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${focusedField === "2fa" ? "scale-110 text-amber-500" : "text-gray-400"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="2FA Authentication Code" 
                onFocus={() => setFocusedField("2fa")}
                onBlur={() => setFocusedField("")}
                className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white placeholder-gray-500 text-sm sm:text-base group-hover:shadow-md"
              />
            </div>
          </div>

          {/* Bank Selection */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="relative">
              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${focusedField === "bank" ? "scale-110 text-amber-500" : "text-gray-400"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <select 
                onFocus={() => setFocusedField("bank")}
                onBlur={() => setFocusedField("")}
                className="w-full pl-12 pr-10 py-3 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white text-sm sm:text-base group-hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="">Select Payment Method</option>
                <optgroup label="International">
                  <option value="bank">Bank Account</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="paypal">PayPal</option>
                </optgroup>
                <optgroup label="Ethiopian Banks">
                  <option value="cbe">Commercial Bank of Ethiopia (CBE)</option>
                  <option value="awash">Awash Bank</option>
                  <option value="dashen">Dashen Bank</option>
                  <option value="nib">Nib International Bank</option>
                  <option value="boa">Bank of Abyssinia</option>
                </optgroup>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-4 rounded-2xl animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-red-700 text-sm sm:text-base font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Save Button */}
          <button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white font-bold px-4 sm:px-6 py-4 sm:py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 active:scale-95 text-sm sm:text-base relative overflow-hidden group"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center space-x-2">
              <span>Save Security Settings</span>
              <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </span>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-300 disabled:to-red-400 text-white font-bold px-4 sm:px-6 py-4 sm:py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 active:scale-95 disabled:transform-none disabled:hover:shadow-xl text-sm sm:text-base relative overflow-hidden group"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center space-x-2">
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              {!isLoggingOut && (
                <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              )}
              {isLoggingOut && (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
            </span>
          </button>
        </div>

        {/* Enhanced footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <span>Your security settings are encrypted and protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Security;