function Sidebar({ setActiveSection, activeSection }) {
  const navItem = [
    { id: "Profile", label: "Profile", icon: "👤" },
    { id: "PersonalInfo", label: "Personal Info", icon: "📋" },
    { id: "Security", label: "Security", icon: "🔒" },
    { id: "VerifyKYC", label: "Verify KYC", icon: "✅" },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // Example: redirect to login page or clear user session
  };

  return (
    <div className="w-80 min-h-screen bg-gradient-to-b from-white/95 to-yellow-50/95 backdrop-blur-md border-r border-black/10 shadow-2xl">
      {/* Header */}
      <div className="p-8 border-b border-black/10 bg-gradient-to-r from-yellow-100/50 to-white/80">
        <h2 className="text-2xl font-bold text-black mb-2">Settings</h2>
        <p className="text-black/70 text-sm">Manage your account preferences</p>
      </div>

      {/* Navigation */}
      <div className="p-6">
        <ul className="space-y-2">
          {navItem.map((item) => (
            <li key={item.id}>
              <button
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center space-x-3 group ${
                  activeSection === item.id
                    ? "bg-black text-white shadow-lg transform scale-105"
                    : "hover:bg-yellow-100/70 hover:shadow-md text-black/80 hover:text-black"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                <div className={`ml-auto transition-transform duration-300 ${
                  activeSection === item.id ? "rotate-90" : "group-hover:translate-x-1"
                }`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                  </svg>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="mt-12 pt-6 border-t border-black/10">
          <button
            onClick={handleLogout}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 hover:text-red-800 font-medium transition-all duration-300 flex items-center space-x-3 group hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17,7L15.59,8.41L18.17,11H8V13H18.17L15.59,15.59L17,17L22,12L17,7M4,5H12V3H4C2.89,3 2,3.89 2,5V19C2,20.11 2.89,21 4,21H12V19H4V5Z"/>
            </svg>
            <span>Log Out</span>
            <div className="ml-auto transition-transform duration-300 group-hover:translate-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
              </svg>
            </div>
          </button>
        </div>

        {/* User Info Section */}
        <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-yellow-50/80 to-white/80 border border-black/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-200 to-amber-200 flex items-center justify-center">
              <span className="text-black font-bold">U</span>
            </div>
            <div>
              <p className="text-black font-medium text-sm">User Account</p>
              <p className="text-black/60 text-xs">Premium Member</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;