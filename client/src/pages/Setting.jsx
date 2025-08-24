
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
            {/* Header Section */}
            <div className="bg-gradient-to-r from-amber-100/50 to-yellow-100/50 backdrop-blur-sm p-6 border-b border-amber-200/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-amber-900 drop-shadow-sm">
                    Account Settings
                  </h1>
                  <p className="text-amber-700 mt-1 drop-shadow-sm">
                    Manage your TradeWise account preferences
                  </p>
                </div>
                
                {/* Decorative Element */}
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

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