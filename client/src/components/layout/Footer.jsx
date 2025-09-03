import { useState, useEffect } from "react"

const TrendingUp = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
)

const Footer = () => {
  const [particles, setParticles] = useState([])
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    // Generate floating golden particles for footer background
    const generateFooterParticles = () => {
      const newParticles = []
      for (let i = 0; i < 12; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 2,
          color: ["bg-yellow-400", "bg-amber-400", "bg-orange-400"][Math.floor(Math.random() * 3)],
          opacity: Math.random() * 0.3 + 0.1,
          duration: Math.random() * 15 + 10,
          delay: Math.random() * 3,
        })
      }
      setParticles(newParticles)
    }
    generateFooterParticles()

    // Add CSS animations
    const styleElement = document.createElement('style')
    styleElement.textContent = `
      @keyframes floatSlow {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-15px) rotate(90deg); }
        50% { transform: translateY(-8px) rotate(180deg); }
        75% { transform: translateY(-20px) rotate(270deg); }
      }
    `
    document.head.appendChild(styleElement)

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement)
      }
    }
  }, [])

  const socialIcons = {
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  }

  const contactIcons = {
    email: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    phone: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    location: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  }

  return (
    <footer className="relative bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full ${particle.color} animate-pulse shadow-lg`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              boxShadow: "0 0 15px rgba(251, 191, 36, 0.2)",
              animation: `floatSlow ${particle.duration}s ease-in-out infinite ${particle.delay}s, pulse ${particle.duration * 0.8}s ease-in-out infinite ${particle.delay}s`,
            }}
          />
        ))}
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-yellow-900/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Information */}
          <div className="space-y-6">
            {/* Logo matching the header */}
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-amber-400 w-8 h-8" />
              <span className="text-white text-2xl font-bold">TradeWise</span>
            </div>

            <p className="text-amber-200 text-sm leading-relaxed drop-shadow-sm">
              Your Gateway to Smart Trading. Experience the future of trading with cutting-edge analytics and professional insights.
            </p>

            <div className="flex space-x-4">
              {Object.entries(socialIcons).map(([platform, icon]) => (
                <a
                  key={platform}
                  href="#"
                  className="text-amber-400 hover:text-amber-300 transition-all duration-300 p-3 rounded-full bg-black bg-opacity-30 backdrop-blur-sm hover:bg-opacity-50 hover:scale-110 border border-amber-500/20 hover:border-amber-400/40 shadow-lg"
                  aria-label={`Follow us on ${platform}`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Trading Services */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-amber-400 border-b border-amber-500/30 pb-2">
              Trading Services
            </h4>
            <ul className="space-y-4">
              {[
                "Real-Time Analytics",
                "Portfolio Management", 
                "Market Insights",
                "Trading Signals",
                "Risk Management",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-amber-200 hover:text-amber-100 transition-colors duration-300 text-sm hover:translate-x-1 transform block py-1 drop-shadow-sm"
                  >
                    • {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Resources */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-amber-400 border-b border-amber-500/30 pb-2">
              Learn & Grow
            </h4>
            <ul className="space-y-4">
              {[
                "Market Education",
                "Trading Tutorials", 
                "Expert Analysis",
                "Webinars",
                "Trading Community",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-amber-200 hover:text-amber-100 transition-colors duration-300 text-sm hover:translate-x-1 transform block py-1 drop-shadow-sm"
                  >
                    • {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-amber-400 border-b border-amber-500/30 pb-2">
              Get In Touch
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start group">
                <div className="mt-1 mr-4 text-amber-400 group-hover:text-amber-300 transition-colors">
                  {contactIcons.email}
                </div>
                <span className="text-sm text-amber-200 group-hover:text-amber-100 transition-colors">
                  support@tradewise.com
                </span>
              </li>
              <li className="flex items-start group">
                <div className="mt-1 mr-4 text-amber-400 group-hover:text-amber-300 transition-colors">
                  {contactIcons.phone}
                </div>
                <span className="text-sm text-amber-200 group-hover:text-amber-100 transition-colors">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-start group">
                <div className="mt-1 mr-4 text-amber-400 group-hover:text-amber-300 transition-colors">
                  {contactIcons.location}
                </div>
                <span className="text-sm text-amber-200 group-hover:text-amber-100 transition-colors">
                  Financial District, New York
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider with golden accent */}
        <div className="border-t border-amber-500/30 my-8 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-yellow-600 w-16 h-0.5"></div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-amber-300 text-sm drop-shadow-sm">
            © {currentYear} TradeWise Inc. All rights reserved.
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              "Privacy Policy",
              "Terms of Service", 
              "Security",
              "Compliance",
              "Risk Disclosure",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="text-amber-200 hover:text-amber-100 text-sm transition-all duration-300 hover:scale-105 drop-shadow-sm"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="flex items-center space-x-4 text-xs text-amber-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span>Licensed</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer