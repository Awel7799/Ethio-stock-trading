"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Custom SVG Icons
const TrendingUp = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
)

const PieChart = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
  </svg>
)

const Users = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const Shield = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
)

const Clock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
)

const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9 12l2 2 4-4"></path>
    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.86 0 3.58.57 5.01 1.54"></path>
  </svg>
)

// Animated background shapes component
const AnimatedBackground = () => {
  const [shapes, setShapes] = useState([])
  useEffect(() => {
    const generateShapes = () => {
      const newShapes = []
      for (let i = 0; i < 20; i++) {
        newShapes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 60 + 20,
          color: ["bg-purple-500", "bg-blue-500", "bg-pink-500", "bg-cyan-500", "bg-emerald-500"][
            Math.floor(Math.random() * 5)
          ],
          opacity: Math.random() * 0.3 + 0.1,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
        })
      }
      setShapes(newShapes)
    }
    generateShapes()
  }, [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={`absolute rounded-full ${shape.color} animate-pulse`}
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            opacity: shape.opacity,
            animationDuration: `${shape.duration}s`,
            animationDelay: `${shape.delay}s`,
          }}
        />
      ))}
      {/* Floating geometric shapes */}
      <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 transform rotate-45 animate-bounce opacity-20"></div>
      <div className="absolute bottom-32 left-10 w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse opacity-30"></div>
      <div className="absolute top-1/2 right-10 w-8 h-20 bg-gradient-to-r from-emerald-400 to-blue-400 transform rotate-12 animate-pulse opacity-25"></div>
      <div className="absolute bottom-20 right-32 w-14 h-14 bg-gradient-to-r from-pink-400 to-purple-400 transform rotate-45 animate-bounce opacity-20"></div>
    </div>
  )
}

// Sign Up Component
const SignUpForm = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all fields")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    // Add sign up logic here
    console.log("Sign up data:", formData)
    alert("Sign up successful! (This is a demo)")
    onClose()
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">
          ×
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Create Account
          </button>
        </div>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="text-purple-600 hover:text-purple-800 font-medium">
            Log in
          </button>
        </p>
      </div>
    </div>
  )
}

// Login Component
const LoginForm = ({ onClose, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields")
      return
    }
    // Add login logic here
    console.log("Login data:", formData)
    alert("Login successful! (This is a demo)")
    onClose()
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">
          ×
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Log In</h2>
        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600 text-sm">Remember me</span>
            </label>
            <a href="#" className="text-purple-600 hover:text-purple-800 text-sm">
              Forgot Password?
            </a>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Log In
          </button>
        </div>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <button onClick={onSwitchToSignUp} className="text-purple-600 hover:text-purple-800 font-medium">
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}

// Main Landing Page Component
const TradeWiseLanding = () => {
  const [showSignUp, setShowSignUp] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const navigate = useNavigate()

  const handleSignUpClick = () => {
    console.log("Sign up button clicked") // Debug log
    setShowSignUp(true)
    setShowLogin(false)
  }

  const handleLoginClick = () => {
    console.log("Login button clicked") // Debug log
    setShowLogin(true)
    setShowSignUp(false)
  }

  const handleStartTradingClick = () => {
    console.log("Start trading button clicked") // Debug log
    navigate("/markets")
  }

  const handleCloseModals = () => {
    console.log("Closing modals") // Debug log
    setShowSignUp(false)
    setShowLogin(false)
  }

  const handleSwitchToLogin = () => {
    console.log("Switching to login") // Debug log
    setShowSignUp(false)
    setShowLogin(true)
  }

  const handleSwitchToSignUp = () => {
    console.log("Switching to sign up") // Debug log
    setShowLogin(false)
    setShowSignUp(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <AnimatedBackground />
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-black bg-opacity-30 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <TrendingUp className="text-white w-8 h-8" />
          <span className="text-white text-xl font-bold">TradeWise</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-white hover:text-purple-300 transition-colors">
            Products
          </a>
          <a href="#" className="text-white hover:text-purple-300 transition-colors">
            Learn
          </a>
          <a href="#" className="text-white hover:text-purple-300 transition-colors">
            Pricing
          </a>
          <a href="#" className="text-white hover:text-purple-300 transition-colors">
            Support
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSignUpClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            Sign up
          </button>
          <button
            onClick={handleLoginClick}
            className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-purple-900 transition-all duration-300"
          >
            Log in
          </button>
        </div>
      </header>
      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-50 mb-6 leading-tight">Welcome to TradeWise</h1>
          <p className="text-xl md:text-2xl text-white  mb-8 font-light">Your Gateway to Smart Trading</p>
          <p className="text-lg text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of trading with our cutting-edge platform. Get real-time market insights, advanced
            analytics, and powerful tools designed to help you make informed trading decisions.
          </p>
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-transparent backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-amber-50 mb-2">Real-Time Analytics</h3>
              <p className="text-purple-200 text-sm">Advanced market analysis and live trading signals</p>
            </div>
            <div className="bg-transparent backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-amber-50 mb-2">Portfolio Management</h3>
              <p className="text-purple-200 text-sm">Track and optimize your investments with ease</p>
            </div>
            <div className="bg-transparent backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105">
              <div className="bg-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-amber-50 mb-2">Expert Insights</h3>
              <p className="text-purple-200 text-sm">Learn from professional traders and market experts</p>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={handleStartTradingClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Trading Today
            </button>
            <button
              onClick={handleLoginClick}
              className="bg-gray-800 bg-opacity-50 px-8 py-3 rounded-full text-lg font-semibold hover:from-black hover:to-white text-amber-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Welcome Back
            </button>
          </div>
        </div>
      </main>
      {/* Trust Indicators */}
      <div className="relative z-10 flex items-center justify-center space-x-8 pb-8">
        <div className="flex items-center space-x-2 text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Trusted by 100K+ traders</span>
        </div>
        <div className="flex items-center space-x-2 text-blue-400">
          <Shield className="w-4 h-4" />
          <span className="text-sm">Bank-grade security</span>
        </div>
        <div className="flex items-center space-x-2 text-purple-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm">24/7 support</span>
        </div>
      </div>
      {/* Modals */}
      {showSignUp && <SignUpForm onClose={handleCloseModals} onSwitchToLogin={handleSwitchToLogin} />}
      {showLogin && <LoginForm onClose={handleCloseModals} onSwitchToSignUp={handleSwitchToSignUp} />}
    </div>
  )
}

export default TradeWiseLanding