//components/AIAssistantIcon.jsx
import { useState } from "react"
import AIchat from "./AIchat"

export default function AIAssistantIcon() {
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      {/* AI Assistant Floating Icon */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAIOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black p-4 rounded-full shadow-2xl transition-all duration-300 transform ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          style={{
            boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)',
          }}
        >
          {/* Modern AI Brain/Assistant Icon */}
          <svg 
            className="w-8 h-8" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            {/* AI Brain Shape */}
            <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.63 3.34 1.68 4.58-.05.14-.08.28-.08.42 0 .83.67 1.5 1.5 1.5.28 0 .54-.08.76-.21C9.56 16.19 10.72 17 12 17s2.44-.81 3.14-1.71c.22.13.48.21.76.21.83 0 1.5-.67 1.5-1.5 0-.14-.03-.28-.08-.42C18.37 12.34 19 10.74 19 9c0-3.87-3.13-7-7-7z"/>
            
            {/* Neural Network Dots */}
            <circle cx="9.5" cy="8.5" r="0.8" fill="rgba(0,0,0,0.8)"/>
            <circle cx="14.5" cy="8.5" r="0.8" fill="rgba(0,0,0,0.8)"/>
            <circle cx="12" cy="6" r="0.6" fill="rgba(0,0,0,0.6)"/>
            <circle cx="12" cy="11" r="0.6" fill="rgba(0,0,0,0.6)"/>
            
            {/* Neural Network Lines */}
            <line x1="9.5" y1="8.5" x2="12" y2="6" stroke="rgba(0,0,0,0.4)" strokeWidth="1"/>
            <line x1="14.5" y1="8.5" x2="12" y2="6" stroke="rgba(0,0,0,0.4)" strokeWidth="1"/>
            <line x1="9.5" y1="8.5" x2="12" y2="11" stroke="rgba(0,0,0,0.4)" strokeWidth="1"/>
            <line x1="14.5" y1="8.5" x2="12" y2="11" stroke="rgba(0,0,0,0.4)" strokeWidth="1"/>
            
            {/* Chat Indicator */}
            <path d="M4 19v-2c0-1.1.9-2 2-2h1c.55 0 1 .45 1 1s-.45 1-1 1H6v2h12v-2h-1c-.55 0-1-.45-1-1s.45-1 1-1h1c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2z" opacity="0.6"/>
          </svg>

          {/* Animated Pulse Rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 animate-pulse opacity-10"></div>
          
          {/* Smart Indicator Dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          
          {/* Hover Tooltip */}
          {isHovered && (
            <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm rounded-xl whitespace-nowrap backdrop-blur-sm shadow-xl border border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">AI Trading Assistant</span>
              </div>
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          )}
        </button>
        
        {/* Floating Animation Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-2 -left-2 w-1 h-1 bg-amber-400 rounded-full animate-bounce opacity-70" style={{animationDelay: '0s'}}></div>
          <div className="absolute -top-1 -right-3 w-1 h-1 bg-yellow-500 rounded-full animate-bounce opacity-50" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute -bottom-2 -left-1 w-1 h-1 bg-amber-500 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}></div>
        </div>
      </div>

      {/* AI Chat Modal */}
      <AIchat isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  )
}