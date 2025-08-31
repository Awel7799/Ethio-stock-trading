import { useState } from "react";

function Profile() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    setError("");
    alert("Profile updated");
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Edit Profile
          </h2>
          <p className="text-gray-600 text-sm mt-2">Customize your profile settings</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Profile Photo */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Profile Photo
            </label>
            <div className="relative">
              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 text-gray-400`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <input 
                type="file" 
                accept="image/*"
                className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white text-sm sm:text-base group-hover:shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 file:transition-colors file:duration-300"
              />
            </div>
          </div>

          {/* Username */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Username <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${focusedField === "username" || username ? "scale-110 text-amber-500" : "text-gray-400"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input
                type="text"
                value={username}
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField("")}
                className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white placeholder-gray-500 text-sm sm:text-base group-hover:shadow-md"
              />
            </div>
            {error && (
              <div className="mt-3 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-3 rounded-xl animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Theme Color */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Theme Color
            </label>
            <div className="relative">
              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 text-gray-400`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
                </svg>
              </div>
              <input 
                type="color" 
                defaultValue="#f59e0b"
                className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white text-sm sm:text-base group-hover:shadow-md h-12 sm:h-14"
              />
            </div>
          </div>

          {/* Language */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Language
            </label>
            <div className="relative">
              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${focusedField === "language" ? "scale-110 text-amber-500" : "text-gray-400"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
              </div>
              <select
                onFocus={() => setFocusedField("language")}
                onBlur={() => setFocusedField("")}
                className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white text-sm sm:text-base group-hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="">Select language</option>
                <option value="en">English</option>
                <option value="am">Amharic</option>
                <option value="or">Oromo</option>
                <option value="ti">Tigrinya</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white font-bold px-4 sm:px-6 py-4 sm:py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 active:scale-95 text-sm sm:text-base relative overflow-hidden group"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center space-x-2">
              <span>Save Profile</span>
              <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </span>
          </button>
        </div>

        {/* Enhanced footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <span>Profile changes are saved automatically</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;