import { useState } from "react";

function PersonalInfo() {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    address: "",
    phone: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Name and Email are required");
      return;
    }
    setError("");
    alert("Personal info saved");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-200/30 to-amber-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="w-[85%] bg-white/95 backdrop-blur-lg p-2 sm:p-3 md:p-4 shadow-2xl rounded-3xl border border-amber-100/50 relative z-10 transform hover:scale-[1.01] transition-transform duration-500 b">
        {/* Enhanced header with icon */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl shadow-lg mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Personal Information
          </h2>
        </div>
        <div className="space-y-4 sm:space-y-6">
          {/* Enhanced inputs with floating labels effect */}
          <div className="relative group">
            <input 
              name="name" 
              type="text" 
              placeholder="    Full legal name" 
              value={form.name}
              onChange={handleChange} 
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField("")}
              className="w-full border-1 shadow-md border-gray-200 p-3 sm:p-4 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white placeholder-gray-500 text-sm sm:text-base group-hover:shadow-md"
            />
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${focusedField === "name" || form.name ? "scale-110 text-amber-500" : "text-gray-400"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>

          <div className="relative group">
            <input 
              name="dob" 
              type="date" 
              value={form.dob}
              onChange={handleChange} 
              onFocus={() => setFocusedField("dob")}
              onBlur={() => setFocusedField("")}
              className="w-full border-1 shadow-md border-gray-200 p-3 sm:p-4 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white text-sm sm:text-base group-hover:shadow-md"
            />
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${focusedField === "dob" || form.dob ? "scale-110 text-amber-500" : "text-gray-400"}`}>
              <svg className=" pl-9 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>

          <div className="relative group">
            <input 
              name="address" 
              type="text" 
              placeholder="     Residential address" 
              value={form.address}
              onChange={handleChange} 
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField("")}
              className="w-full border-1 shadow-md border-gray-200 p-3 sm:p-4 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white placeholder-gray-500 text-sm sm:text-base group-hover:shadow-md"
            />
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${focusedField === "address" || form.address ? "scale-110 text-amber-500" : "text-gray-400"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
          </div>

          <div className="relative group">
            <input 
              name="phone" 
              type="tel" 
              placeholder="     +251..." 
              value={form.phone}
              onChange={handleChange} 
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField("")}
              className="w-full border-1 shadow-md border-gray-200 p-3 sm:p-4 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white placeholder-gray-500 text-sm sm:text-base group-hover:shadow-md"
            />
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${focusedField === "phone" || form.phone ? "scale-110 text-amber-500" : "text-gray-400"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
          </div>

          <div className="relative group">
            <input 
              name="email" 
              type="email" 
              placeholder="     Email address" 
              value={form.email}
              onChange={handleChange} 
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField("")}
              className="w-full border-1 shadow-md border-gray-200 p-3 sm:p-4 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white placeholder-gray-500 text-sm sm:text-base group-hover:shadow-md"
            />
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${focusedField === "email" || form.email ? "scale-110 text-amber-500" : "text-gray-400"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
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

          <button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white font-bold px-4 sm:px-6 py-4 sm:py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 active:scale-95 text-sm sm:text-base relative overflow-hidden group"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center space-x-2">
              <span>Save Information</span>
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
            <span>Your data is secure and protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;