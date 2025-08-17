"use client"

import { useState, useEffect } from "react"
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

const AnimatedBackground = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
      // Golden floating particles
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 8 + 3,
          color: ["bg-yellow-400", "bg-amber-400", "bg-orange-400", "bg-yellow-300"][Math.floor(Math.random() * 4)],
          opacity: Math.random() * 0.4 + 0.1,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
        })
      }
      // Larger glowing orbs
      for (let i = 20; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 15,
          color: "bg-gradient-to-r from-yellow-400 to-amber-500",
          opacity: Math.random() * 0.2 + 0.05,
          duration: Math.random() * 25 + 15,
          delay: Math.random() * 8,
        })
      }
      setParticles(newParticles)
    }
    generateParticles()
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Golden coins background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/many_coins_on_each_other_and_same_of_them_are_getting_down_and_background_is_black_but_the_focus_on_nb4804sofwvq5rup2oed_3-jbDsna7mVV7BsTyiDBwO4bLyM7C9V0.png")',
          filter: "brightness(0.6) contrast(1.4)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-amber-900/20 to-black/60" />

      {/* Animated golden particles */}
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
            boxShadow: "0 0 20px rgba(251, 191, 36, 0.3)",
            transform: "translateY(0px)",
            animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s, glow ${particle.duration * 0.7}s ease-in-out infinite ${particle.delay}s`,
          }}
        />
      ))}

      {/* CSS animations for floating and glowing effects */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          75% { transform: translateY(-30px) rotate(270deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.3); }
          50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.3); }
        }
      `}</style>
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

const ErrorMessage = ({ error, onRetry }) => {
  const errorDetails = {
    title: "",
    message: "",
    suggestions: [],
    showRetry: false,
    isAlert: false,
  }

  const getErrorDetails = (errorMessage) => {
    if (!errorMessage) return null

    // User doesn't exist
    if (
      errorMessage.includes("User not found") ||
      errorMessage.includes("No user found") ||
      errorMessage.includes("Account does not exist") ||
      errorMessage.includes("404")
    ) {
      return {
        title: "👤 Account Not Found",
        message: "We couldn't find an account with this email address.",
        suggestions: [
          "Double-check your email address for typos",
          "Try creating a new account instead",
          "Make sure you're using the right email",
        ],
        showRetry: false,
        isAlert: true, // Mark critical errors for alert display
      }
    }

    // Connection errors
    if (
      errorMessage.includes("ERR_CONNECTION_REFUSED") ||
      errorMessage.includes("Cannot connect to server") ||
      errorMessage.includes("Failed to fetch")
    ) {
      return {
        title: "🔌 Connection Problem",
        message: "We're having trouble connecting to our servers.",
        suggestions: [
          "Check your internet connection",
          "The server might be temporarily down",
          "Try again in a few moments",
        ],
        showRetry: true,
        isAlert: true, // Mark critical errors for alert display
      }
    }

    // Authentication errors
    if (
      errorMessage.includes("Invalid credentials") ||
      errorMessage.includes("Wrong password") ||
      errorMessage.includes("Incorrect password") ||
      errorMessage.includes("Unauthorized") ||
      errorMessage.includes("401")
    ) {
      return {
        title: "🔐 Login Failed",
        message: "The email or password you entered is incorrect.",
        suggestions: [
          "Double-check your email address",
          "Make sure your password is correct",
          "Try using 'Forgot Password' if needed",
        ],
        showRetry: false,
        isAlert: true, // Mark critical errors for alert display
      }
    }

    // User already exists
    if (errorMessage.includes("already exists") || errorMessage.includes("duplicate") || errorMessage.includes("409")) {
      return {
        title: "👤 Account Already Exists",
        message: "An account with this email already exists.",
        suggestions: [
          "Try logging in instead of signing up",
          "Use a different email address",
          "Use 'Forgot Password' if you can't remember your password",
        ],
        showRetry: false,
        isAlert: true, // Mark critical errors for alert display
      }
    }

    // Email format errors
    if (errorMessage.includes("Invalid email") || errorMessage.includes("Email format")) {
      return {
        title: "📧 Invalid Email",
        message: "The email address format is not valid.",
        suggestions: [
          "Make sure your email includes @ and a domain",
          "Check for typos in your email address",
          "Try a different email format",
        ],
        showRetry: false,
        isAlert: false, // Mark non-critical errors for alert display
      }
    }

    // Password too weak
    if (errorMessage.includes("Password too weak") || errorMessage.includes("Password requirements")) {
      return {
        title: "🔒 Password Too Weak",
        message: "Your password doesn't meet our security requirements.",
        suggestions: [
          "Use at least 8 characters",
          "Include uppercase and lowercase letters",
          "Add numbers and special characters",
        ],
        showRetry: false,
        isAlert: false, // Mark non-critical errors for alert display
      }
    }

    // Server errors
    if (errorMessage.includes("500") || errorMessage.includes("Internal Server Error")) {
      return {
        title: "⚠️ Server Issue",
        message: "Our servers are experiencing some problems.",
        suggestions: [
          "This is temporary - please try again",
          "Our team has been notified",
          "Check our status page for updates",
        ],
        showRetry: true,
        isAlert: true, // Mark all errors for alert display
      }
    }

    // Network timeout
    if (errorMessage.includes("timeout") || errorMessage.includes("ETIMEDOUT")) {
      return {
        title: "⏱️ Request Timeout",
        message: "The request took too long to complete.",
        suggestions: [
          "Check your internet connection",
          "Try again with a stable connection",
          "The server might be busy",
        ],
        showRetry: true,
        isAlert: true, // Mark all errors for alert display
      }
    }

    // Rate limiting
    if (errorMessage.includes("Too many requests") || errorMessage.includes("Rate limit")) {
      return {
        title: "🚦 Too Many Attempts",
        message: "You've made too many requests. Please wait a moment.",
        suggestions: [
          "Wait a few minutes before trying again",
          "Avoid rapid repeated attempts",
          "Contact support if this persists",
        ],
        showRetry: true,
        isAlert: true, // Mark all errors for alert display
      }
    }

    // Default error
    return {
      title: "❌ Something Went Wrong",
      message: errorMessage,
      suggestions: ["Please try again", "If the problem persists, contact support", "Check your internet connection"],
      showRetry: true,
      isAlert: true, // Mark all errors for alert display
    }
  }

  useEffect(() => {
    const details = getErrorDetails(error)
    if (details && details.isAlert) {
      const alertMessage = `${details.title}\n\n${details.message}\n\nWhat you can do:\n${details.suggestions.map((s) => `• ${s}`).join("\n")}`
      alert(alertMessage)
    }
  }, [error])

  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6 shadow-lg">
      {" "}
      {/* Made more prominent with thicker border and larger padding */}
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          {" "}
          {/* Added error icon */}
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">!</span>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-red-800 font-bold text-lg mb-3">{errorDetails.title}</h4>{" "}
          {/* Made title larger and bolder */}
          <p className="text-red-700 text-base mb-4 font-medium">{errorDetails.message}</p> {/* Made message larger */}
          <div className="space-y-2">
            <p className="text-red-600 text-sm font-bold">What you can do:</p> {/* Made suggestions header bold */}
            <ul className="text-red-600 text-sm space-y-2">
              {" "}
              {/* Added more spacing between suggestions */}
              {errorDetails.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-3 text-red-500 font-bold">•</span> {/* Made bullet points more prominent */}
                  <span className="font-medium">{suggestion}</span> {/* Made suggestion text medium weight */}
                </li>
              ))}
            </ul>
          </div>
          {errorDetails.showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md" // Made retry button more prominent
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

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

  const handleRetry = () => {
    setErrors({})
    // Clear any connection-related errors and allow user to try again
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    console.log("📧 LANDING: Starting signup process")
    setLoading(true)
    setErrors({}) // Clear previous errors

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
        const errorMessage = result.message || "Sign up failed. Please try again."
        setErrors({ submit: errorMessage })

        setTimeout(() => {
          if (errorMessage.includes("already exists") || errorMessage.includes("duplicate")) {
            alert(
              "👤 Account Already Exists\n\nAn account with this email already exists.\n\n• Try logging in instead\n• Use a different email address\n• Use 'Forgot Password' if needed",
            )
          }
        }, 100)
      }
    } catch (error) {
      console.error("❌ LANDING: Sign up error:", error)
      let errorMessage = "An error occurred during sign up. Please try again."
      if (error.message) {
        errorMessage = error.message
      } else if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage = "ERR_CONNECTION_REFUSED - Cannot connect to server"
      }
      setErrors({ submit: errorMessage })

      setTimeout(() => {
        alert(
          "🔌 Connection Problem\n\nWe're having trouble connecting to our servers.\n\n• Check your internet connection\n• The server might be temporarily down\n• Try again in a few moments",
        )
      })
    } finally {
      setLoading(false)
    }
  }

  // Keep your existing signup form JSX but replace the error display
  return (
    <>
      {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />}
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-amber-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-amber-600 hover:text-amber-800 text-2xl font-light transition-colors"
            disabled={loading}
          >
            ×
          </button>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-amber-900 mb-2">Create Account</h2>
            <p className="text-amber-700">Join TradeWise and start your trading journey</p>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                    errors.firstName ? "border-red-500 bg-red-50" : "border-amber-300 focus:border-transparent bg-white"
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                    errors.lastName ? "border-red-500 bg-red-50" : "border-amber-300 focus:border-transparent bg-white"
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                  errors.email ? "border-red-500 bg-red-50" : "border-amber-300 focus:border-transparent bg-white"
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
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                  errors.password ? "border-red-500 bg-red-50" : "border-amber-300 focus:border-transparent bg-white"
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
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
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                  errors.confirmPassword
                    ? "border-red-500 bg-red-50"
                    : "border-amber-300 focus:border-transparent bg-white"
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            {errors.submit && <ErrorMessage error={errors.submit} onRetry={handleRetry} />}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black py-3 rounded-lg hover:from-amber-400 hover:to-yellow-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transform hover:scale-[1.02] shadow-lg"
            >
              {loading ? <LoadingSpinner /> : "Create Account"}
            </button>
          </form>
          <p className="text-center text-amber-700 mt-6">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-amber-600 hover:text-amber-800 font-semibold transition-colors"
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
  const { login } = useAuth()
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

  const handleRetry = () => {
    setErrors({})
    // Clear any connection-related errors and allow user to try again
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    console.log("[v0] Starting login process")
    setLoading(true)
    setErrors({}) // Clear previous errors

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      })
      console.log("[v0] Login result:", result)

      if (result.success) {
        console.log("[v0] Login successful - should redirect automatically")
        setSuccessMessage("Welcome back! Redirecting to dashboard...")
        setTimeout(() => {
          setSuccessMessage("")
          onClose()
        }, 1500)
      } else {
        console.log("[v0] Login failed:", result.message)
        const errorMessage = result.message || "Login failed. Please check your credentials."
        setErrors({ submit: errorMessage })

        setTimeout(() => {
          if (errorMessage.includes("User not found") || errorMessage.includes("No user found")) {
            alert(
              "❌ Account Not Found\n\nWe couldn't find an account with this email address.\n\n• Double-check your email for typos\n• Try creating a new account instead",
            )
          } else if (errorMessage.includes("Invalid credentials") || errorMessage.includes("Wrong password")) {
            alert(
              "❌ Login Failed\n\nThe email or password you entered is incorrect.\n\n• Double-check your email and password\n• Try using 'Forgot Password' if needed",
            )
          }
        }, 100)
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      let errorMessage = "An error occurred during login. Please try again."
      if (error.message) {
        errorMessage = error.message
      } else if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage = "ERR_CONNECTION_REFUSED - Cannot connect to server"
      }
      setErrors({ submit: errorMessage })

      setTimeout(() => {
        alert(
          "🔌 Connection Problem\n\nWe're having trouble connecting to our servers.\n\n• Check your internet connection\n• The server might be temporarily down\n• Try again in a few moments",
        )
      }, 100)
    } finally {
      setLoading(false)
    }
  }

  // Keep your existing login form JSX but replace the error display
  return (
    <>
      {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />}
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-amber-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-amber-600 hover:text-amber-800 text-2xl font-light transition-colors"
            disabled={loading}
          >
            ×
          </button>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-amber-900 mb-2">Welcome Back</h2>
            <p className="text-amber-700">Sign in to your TradeWise account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                  errors.email ? "border-red-500 bg-red-50" : "border-amber-300 focus:border-transparent bg-white"
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
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                  errors.password ? "border-red-500 bg-red-50" : "border-amber-300 focus:border-transparent bg-white"
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
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
                  className="mr-2 rounded accent-amber-500"
                  disabled={loading}
                />
                <span className="text-amber-700 text-sm">Remember me</span>
              </label>
              <button
                type="button"
                className="text-amber-600 hover:text-amber-800 text-sm font-medium transition-colors"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>
            {errors.submit && <ErrorMessage error={errors.submit} onRetry={handleRetry} />}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black py-3 rounded-lg hover:from-amber-400 hover:to-yellow-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transform hover:scale-[1.02] shadow-lg"
            >
              {loading ? <LoadingSpinner /> : "Sign In"}
            </button>
          </form>
          <p className="text-center text-amber-700 mt-6">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToSignUp}
              className="text-amber-600 hover:text-amber-800 font-semibold transition-colors"
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
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

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

  // Keep all your existing landing page JSX but add animation classes
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <header
        className={`relative z-10 flex items-center justify-between px-6 py-4 bg-black bg-opacity-40 backdrop-blur-sm border-b border-amber-500/20 transform transition-all duration-1000 ${
          isLoaded ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        {/* ... existing header content ... */}
        <div className="flex items-center space-x-2">
          <TrendingUp className="text-amber-400 w-8 h-8" />
          <span className="text-white text-xl font-bold">TradeWise</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-white hover:text-amber-300 transition-colors">
            Features
          </a>
          <a href="#about" className="text-white hover:text-amber-300 transition-colors">
            About
          </a>
          <a href="#pricing" className="text-white hover:text-amber-300 transition-colors">
            Pricing
          </a>
          <a href="#contact" className="text-white hover:text-amber-300 transition-colors">
            Contact
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-white">Welcome, {user?.firstName || "User"}!</span>
              <span className="text-amber-300 text-sm">Redirecting to dashboard...</span>
            </>
          ) : (
            <>
              <button
                onClick={handleSignUpClick}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-6 py-2 rounded-full hover:from-amber-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
              >
                Sign up
              </button>
              <button
                onClick={handleLoginClick}
                className="border border-amber-400 text-amber-400 px-6 py-2 rounded-full hover:bg-amber-400 hover:text-black transition-all duration-300"
              >
                Log in
              </button>
            </>
          )}
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        <div className="text-center max-w-4xl">
          <h1
            className={`text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl transform transition-all duration-1200 ${
              isLoaded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            Welcome to TradeWise
          </h1>

          <p
            className={`text-xl md:text-2xl text-amber-200 mb-8 font-light drop-shadow-lg transform transition-all duration-1200 ${
              isLoaded ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            Your Gateway to Smart Trading
          </p>

          <p
            className={`text-lg text-amber-100 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md transform transition-all duration-1000 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            Experience the future of trading with our cutting-edge platform. Get real-time market insights, advanced
            analytics, and powerful tools designed to help you make informed trading decisions.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div
              className={`bg-black bg-opacity-30 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-40 transition-all duration-300 transform hover:scale-105 border border-amber-500/20 shadow-xl ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              }`}
              style={{ transitionDelay: "900ms", transition: "all 1000ms ease-out" }}
            >
              <div className="bg-gradient-to-r from-amber-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="text-black w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-Time Analytics</h3>
              <p className="text-amber-200 text-sm">Advanced market analysis and live trading signals</p>
            </div>

            <div
              className={`bg-black bg-opacity-30 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-40 transition-all duration-300 transform hover:scale-105 border border-amber-500/20 shadow-xl ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              }`}
              style={{ transitionDelay: "1100ms", transition: "all 1000ms ease-out" }}
            >
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <PieChart className="text-black w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Portfolio Management</h3>
              <p className="text-amber-200 text-sm">Track and optimize your investments with ease</p>
            </div>

            <div
              className={`bg-black bg-opacity-30 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-40 transition-all duration-300 transform hover:scale-105 border border-amber-500/20 shadow-xl ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              }`}
              style={{ transitionDelay: "1300ms", transition: "all 1000ms ease-out" }}
            >
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="text-black w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Expert Insights</h3>
              <p className="text-amber-200 text-sm">Learn from professional traders and market experts</p>
            </div>
          </div>

          <div
            className={`flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 transform transition-all duration-800 ${
              isLoaded ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
            style={{ transitionDelay: "1500ms" }}
          >
            <button
              onClick={handleStartTradingClick}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-8 py-4 rounded-full text-lg font-bold hover:from-amber-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              {isLoggedIn ? "Go to Dashboard" : "Start Trading Today"}
            </button>
            {!isLoggedIn && (
              <button
                onClick={handleLoginClick}
                className="bg-black bg-opacity-40 backdrop-blur-lg px-8 py-4 rounded-full text-lg font-semibold text-amber-400 hover:bg-opacity-60 hover:text-amber-300 transition-all duration-300 transform hover:scale-105 shadow-xl border border-amber-500/30"
              >
                Welcome Back
              </button>
            )}
          </div>
        </div>
      </main>

      <div
        className={`relative z-10 flex items-center justify-center space-x-8 pb-8 transform transition-all duration-800 ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
        style={{ transitionDelay: "1700ms" }}
      >
        <div className="flex items-center space-x-2 text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm drop-shadow-md">Trusted by 100K+ traders</span>
        </div>
        <div className="flex items-center space-x-2 text-amber-400">
          <Shield className="w-4 h-4" />
          <span className="text-sm drop-shadow-md">Bank-grade security</span>
        </div>
        <div className="flex items-center space-x-2 text-yellow-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm drop-shadow-md">24/7 support</span>
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
