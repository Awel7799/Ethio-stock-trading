import { useState, useEffect } from "react";

// Mock Components for the demo
const Button = ({ children, className, ...props }) => (
  <button className={className} {...props}>{children}</button>
);

const Sidebar = ({ setActiveSection, activeSection, onLogout, isLoggingOut }) => {
  const menuItems = [
    { id: "Profile", label: "Profile", icon: "👤" },
    { id: "PersonalInfo", label: "Personal Info", icon: "📋" },
    { id: "Security", label: "Security", icon: "🔒" },
    { id: "VerifyKYC", label: "Verify KYC", icon: "✅" },
  ];

  return (
    <div className="h-full flex flex-col p-4 sm:p-6">
      {/* Sidebar Header */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
          Settings
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your account</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full text-left px-4 py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center space-x-3 group ${
              activeSection === item.id
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg transform scale-105"
                : "text-gray-700 hover:bg-amber-50 hover:text-amber-700 hover:shadow-md"
            }`}
          >
            <span className="text-lg sm:text-xl">{item.icon}</span>
            <span className="font-medium text-sm sm:text-base">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-6 pt-6 border-t border-amber-200/50">
        <button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-300 disabled:to-red-400 text-white font-bold px-4 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 disabled:transform-none text-sm sm:text-base relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative flex items-center justify-center space-x-2">
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            {!isLoggingOut && (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            )}
            {isLoggingOut && (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

// Mock components for demo
const Profile = () => (
  <div className="p-4">
    <h3 className="text-xl font-bold text-amber-600 mb-4">Profile Settings</h3>
    <p className="text-gray-600">Profile content would go here...</p>
  </div>
);

const PersonalInfo = () => (
  <div className="p-4">
    <h3 className="text-xl font-bold text-amber-600 mb-4">Personal Information</h3>
    <p className="text-gray-600">Personal info content would go here...</p>
  </div>
);

const Security = () => (
  <div className="p-4">
    <h3 className="text-xl font-bold text-amber-600 mb-4">Security Settings</h3>
    <p className="text-gray-600">Security content would go here...</p>
  </div>
);

const VerifyKYC = () => (
  <div className="p-4">
    <h3 className="text-xl font-bold text-amber-600 mb-4">Verify KYC</h3>
    <p className="text-gray-600">KYC verification content would go here...</p>
  </div>
);

// Animated Background Component
const AnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      // Golden floating particles
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 2,
          color: ["bg-yellow-400", "bg-amber-400", "bg-orange-400", "bg-yellow-300"][Math.floor(Math.random() * 4)],
          opacity: Math.random() * 0.3 + 0.05,
          duration: Math.random() * 25 + 15,
          delay: Math.random() * 8,
        });
      }
      // Larger glowing orbs
      for (let i = 15; i < 22; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 15 + 10,
          color: "bg-gradient-to-r from-yellow-400 to-amber-500",
          opacity: Math.random() * 0.15 + 0.03,
          duration: Math.random() * 30 + 20,
          delay: Math.random() * 10,
        });
      }
      setParticles(newParticles);
    };
    generateParticles();

    // Add CSS animations to document head
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes settingsFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-15px) rotate(45deg); }
        50% { transform: translateY(-8px) rotate(90deg); }
        75% { transform: translateY(-20px) rotate(135deg); }
      }
      
      @keyframes settingsGlow {
        0%, 100% { box-shadow: 0 0 15px rgba(251, 191, 36, 0.2); }
        50% { box-shadow: 0 0 30px rgba(251, 191, 36, 0.4), 0 0 45px rgba(251, 191, 36, 0.2); }
      }
    `;
    document.head.appendChild(styleElement);

    // Cleanup function
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100" />
      
      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900/5 via-transparent to-yellow-900/5" />

      {/* Animated golden particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.color} animate-pulse shadow-sm`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: "0 0 15px rgba(251, 191, 36, 0.2)",
            transform: "translateY(0px)",
            animation: `settingsFloat ${particle.duration}s ease-in-out infinite ${particle.delay}s, settingsGlow ${particle.duration * 0.8}s ease-in-out infinite ${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function Setting() {
  const [activeSection, setActiveSection] = useState("Profile");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      setIsLoggingOut(true);
      try {
        // Mock logout - replace with actual logout logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert("Logged out successfully!");
      } catch (error) {
        console.error("Logout failed:", error);
      }
      setIsLoggingOut(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Profile":
        return <Profile />;
      case "PersonalInfo":
        return <PersonalInfo />;
      case "Security":
        return <Security />;
      case "VerifyKYC":
        return <VerifyKYC />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Main Content Container */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar Container */}
        <div 
          className={`
            fixed lg:relative inset-y-0 left-0 z-40
            w-72 sm:w-80 lg:w-72 xl:w-80
            transform transition-all duration-500 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            ${isLoaded ? "opacity-100" : "opacity-0"}
          `}
        >
          {/* Mobile Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          <div className="h-full bg-white/90 backdrop-blur-lg border-r border-amber-200/50 shadow-2xl">
            <Sidebar 
              setActiveSection={setActiveSection} 
              activeSection={activeSection}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div 
          className={`
            flex-1 flex flex-col
            ml-0 lg:ml-0
            transform transition-all duration-700 ease-in-out
            ${isLoaded ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
          `}
          style={{ transitionDelay: "200ms" }}
        >
          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-amber-200/40 shadow-2xl overflow-hidden min-h-[600px] sm:min-h-[700px]">
                {/* Content Header */}
                <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-b border-amber-200/30 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    {activeSection === "PersonalInfo" ? "Personal Information" : 
                     activeSection === "VerifyKYC" ? "KYC Verification" : activeSection}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {activeSection === "Profile" && "Customize your profile settings"}
                    {activeSection === "PersonalInfo" && "Update your personal details"}
                    {activeSection === "Security" && "Manage security and privacy"}
                    {activeSection === "VerifyKYC" && "Complete identity verification"}
                  </p>
                </div>

                {/* Content Body */}
                <div className="p-4 sm:p-6 lg:p-8">
                  {renderSection()}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="bg-gradient-to-r from-amber-50/80 to-yellow-50/80 backdrop-blur-sm border-t border-amber-200/50 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between space-y-3 sm:space-y-0 text-xs sm:text-sm text-amber-700">
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm animate-pulse"></div>
                    <span>Auto-save enabled</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
                    </svg>
                    <span>End-to-end encrypted</span>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-xs text-gray-500">Last saved: Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}