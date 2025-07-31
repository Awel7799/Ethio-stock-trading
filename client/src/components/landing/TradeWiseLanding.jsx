"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthContext" // Import external AuthContext

// Keep all your existing SVG Icons (TrendingUp, PieChart, etc.)
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

const Eye = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
)

const EyeOff = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
)

// Keep all your existing components (AnimatedBackground, LoadingSpinner, SuccessMessage)
const AnimatedBackground = () => {
  const [shapes, setShapes] = useState([])

  useState(() => {
    const generateShapes = () => {
      const newShapes = []
      for (let i = 0; i < 15; i++) {
        newShapes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 40 + 15,
          color: ["bg-purple-500", "bg-blue-500", "bg-pink-500", "bg-cyan-500"][Math.floor(Math.random() * 4)],
          opacity: Math.random() * 0.2 + 0.05,
          duration: Math.random() * 15 + 8,
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
          }}
        />
      ))}
    </div>
  )
}

const LoadingSpinner = () => (
  <div className="inline-flex items-center">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
    Loading...
  </div>
)

const SuccessMessage = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
    <CheckCircle className="w-5 h-5 mr-2" />
    <span>{message}</span>
    <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
      ×
    </button>
  </div>
)

// Sign Up Form Component - Use external AuthContext
const SignUpForm = ({ onClose, onSwitchToLogin }) => {
  const { signUp } = useAuth() // Use external AuthContext
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    console.log("📧 LANDING: Starting signup process")
    setLoading(true)
    try {
      const result = await signUp(formData)
      console.log("📧 LANDING: Signup result:", result)

      if (result.success) {
        console.log("✅ LANDING: Signup successful - should redirect automatically")
        setSuccessMessage("Account created successfully! Welcome to TradeWise!")
        setTimeout(() => {
          setSuccessMessage("")
          onClose()
        }, 2000)
      } else {
        console.log("❌ LANDING: Signup failed:", result.message)
        setErrors({ submit: result.message || "Sign up failed. Please try again." })
      }
    } catch (error) {
      console.error("❌ LANDING: Sign up error:", error)
      setErrors({ submit: "An error occurred during sign up. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  // Keep your existing signup form JSX
  return (
    <>
      {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />}
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light transition-colors"
            disabled={loading}
          >
            ×
          </button>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join TradeWise and start your trading journey</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.firstName ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-transparent"
                  }`}
                  disabled={loading}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.lastName ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-transparent"
                  }`}
                  disabled={loading}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-transparent"
                }`}
                disabled={loading}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.password ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-transparent"
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-transparent"
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{errors.submit}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transform hover:scale-[1.02]"
            >
              {loading ? <LoadingSpinner /> : "Create Account"}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-purple-600 hover:text-purple-800 font-semibold transition-colors"
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </>
  )
}

// Login Form Component - Use external AuthContext
const LoginForm = ({ onClose, onSwitchToSignUp }) => {
  const { login } = useAuth() // Use external AuthContext
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    console.log("🔐 LANDING: Starting login process")
    setLoading(true)
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      })
      console.log("🔐 LANDING: Login result:", result)

      if (result.success) {
        console.log("✅ LANDING: Login successful - should redirect automatically")
        setSuccessMessage("Welcome back! Redirecting to dashboard...")
        setTimeout(() => {
          setSuccessMessage("")
          onClose()
        }, 1500)
      } else {
        console.log("❌ LANDING: Login failed:", result.message)
        setErrors({ submit: result.message || "Login failed. Please check your credentials." })
      }
    } catch (error) {
      console.error("❌ LANDING: Login error:", error)
      setErrors({ submit: "An error occurred during login. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  // Keep your existing login form JSX
  return (
    <>
      {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />}
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light transition-colors"
            disabled={loading}
          >
            ×
          </button>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your TradeWise account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-transparent"
                }`}
                disabled={loading}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.password ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-transparent"
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="mr-2 rounded"
                  disabled={loading}
                />
                <span className="text-gray-600 text-sm">Remember me</span>
              </label>
              <button
                type="button"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{errors.submit}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transform hover:scale-[1.02]"
            >
              {loading ? <LoadingSpinner /> : "Sign In"}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToSignUp}
              className="text-purple-600 hover:text-purple-800 font-semibold transition-colors"
              disabled={loading}
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </>
  )
}

// Main Landing Page Component - ONLY LANDING PAGE, NO DASHBOARD
const TradeWiseLanding = () => {
  const { user, isLoggedIn } = useAuth() // Use external AuthContext
  const [showSignUp, setShowSignUp] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const handleSignUpClick = () => {
    setShowSignUp(true)
    setShowLogin(false)
  }

  const handleLoginClick = () => {
    setShowLogin(true)
    setShowSignUp(false)
  }

  const handleStartTradingClick = () => {
    if (!isLoggedIn) {
      setShowLogin(true)
    }
    // If logged in, the routing will handle the redirect automatically
  }

  const handleCloseModals = () => {
    setShowSignUp(false)
    setShowLogin(false)
  }

  const handleSwitchToLogin = () => {
    setShowSignUp(false)
    setShowLogin(true)
  }

  const handleSwitchToSignUp = () => {
    setShowLogin(false)
    setShowSignUp(true)
  }

  // Keep all your existing landing page JSX
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
          <a href="#features" className="text-white hover:text-purple-300 transition-colors">
            Features
          </a>
          <a href="#about" className="text-white hover:text-purple-300 transition-colors">
            About
          </a>
          <a href="#pricing" className="text-white hover:text-purple-300 transition-colors">
            Pricing
          </a>
          <a href="#contact" className="text-white hover:text-purple-300 transition-colors">
            Contact
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-white">Welcome, {user?.firstName || "User"}!</span>
              <span className="text-purple-300 text-sm">Redirecting to dashboard...</span>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </header>

      {/* Keep all your existing main content JSX */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">Welcome to TradeWise</h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8 font-light">Your Gateway to Smart Trading</p>
          <p className="text-lg text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of trading with our cutting-edge platform. Get real-time market insights, advanced
            analytics, and powerful tools designed to help you make informed trading decisions.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-Time Analytics</h3>
              <p className="text-purple-200 text-sm">Advanced market analysis and live trading signals</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Portfolio Management</h3>
              <p className="text-purple-200 text-sm">Track and optimize your investments with ease</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105">
              <div className="bg-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Expert Insights</h3>
              <p className="text-purple-200 text-sm">Learn from professional traders and market experts</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={handleStartTradingClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {isLoggedIn ? "Go to Dashboard" : "Start Trading Today"}
            </button>
            {!isLoggedIn && (
              <button
                onClick={handleLoginClick}
                className="bg-black bg-opacity-20 backdrop-blur-lg px-8 py-4 rounded-full text-lg font-semibold text-white hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Welcome Back
              </button>
            )}
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

// Export ONLY the landing page component - NO AuthProvider wrapper
export default TradeWiseLanding
