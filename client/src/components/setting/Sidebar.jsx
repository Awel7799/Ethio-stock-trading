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
    <div className="w-64 min-h-[86%] mt-18 ml-1.5 pb-0 bg-gradient-to-b  from-white/95 to-yellow-50/95 backdrop-blur-md border-r border-black/10 shadow-xl">
      {/* Navigation */}
      <div className="p-6 pt-8">
        <ul className="space-y-3">
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
        <div className="mt-auto pt-8">
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
      </div>
    </div>
  );
}

export default Sidebar;