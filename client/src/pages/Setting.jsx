//setting
import Button from "../components/comman/Button";
import Sidebar from "../components/setting/Sidebar";
import PersonalInfo from "../components/setting/PersonalInfo";
import Profile from "../components/setting/Profile";
import Security from "../components/setting/security";
import VerifyKYC from "../components/setting/VerifyKYC";
import { useState, useEffect } from "react";

// Animated Background Component (matching landing page)
const AnimatedBackground = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
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
        })
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
        })
      }
      setParticles(newParticles)
    }
    generateParticles()

    // Add CSS animations to document head
    const styleElement = document.createElement('style')
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
    `
    document.head.appendChild(styleElement)

    // Cleanup function
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement)
      }
    }
  }, [])

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
  )
}

export default function Setting() {
  const [activeSection, setActiveSection] = useState("Profile");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

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
      
      {/* Main Content Container */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar Container */}
        <div 
          className={`transform transition-all duration-1000 ${
            isLoaded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
        >
          <div className="bg-black/10 backdrop-blur-sm border-r border-amber-200/50 shadow-xl">
            <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
          </div>
        </div>

        {/* Main Content Area */}
        <div 
          className={`flex-1 transform transition-all duration-1200 ${
            isLoaded ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {/* Content Background */}
          <div className="min-h-screen bg-white/40 backdrop-blur-sm border border-amber-200/30 shadow-2xl m-4 rounded-2xl overflow-hidden">


            {/* Content Area */}
            <div className="p-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-amber-200/40 shadow-lg p-6 min-h-[600px]">
                {renderSection()}
              </div>
            </div>

            {/* Footer Section */}
            <div className="bg-gradient-to-r from-amber-50/50 to-yellow-50/50 backdrop-blur-sm p-4 border-t border-amber-200/50">
              <div className="flex items-center justify-center space-x-6 text-sm text-amber-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm"></div>
                  <span>All changes saved automatically</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
                  </svg>
                  <span>Secure & encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}