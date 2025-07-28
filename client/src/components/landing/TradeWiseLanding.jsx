import React, { createContext, useContext, useState, useEffect } from "react";

// Custom SVG Icons
const TrendingUp = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const PieChart = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
  </svg>
);

const Users = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Shield = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const Clock = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const CheckCircle = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M9 12l2 2 4-4"></path>
    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.86 0 3.58.57 5.01 1.54"></path>
  </svg>
);

// API Configuration - Browser compatible
const API_BASE_URL = "http://localhost:5000/api";

// In-memory storage (replacing localStorage for Claude artifacts)
let memoryStorage = {
  tradewise_access_token: null,
  tradewise_refresh_token: null,
  tradewise_user: null
};

// Token management functions
const getAccessToken = () => {
  return memoryStorage.tradewise_access_token;
};

const getRefreshToken = () => {
  return memoryStorage.tradewise_refresh_token;
};

const getStoredUser = () => {
  try {
    const user = memoryStorage.tradewise_user;
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

const setTokens = (accessToken, refreshToken, user) => {
  try {
    memoryStorage.tradewise_access_token = accessToken;
    if (refreshToken) memoryStorage.tradewise_refresh_token = refreshToken;
    memoryStorage.tradewise_user = JSON.stringify(user);
  } catch (error) {
    console.error("Error storing tokens:", error);
  }
};

const clearTokens = () => {
  try {
    memoryStorage.tradewise_access_token = null;
    memoryStorage.tradewise_refresh_token = null;
    memoryStorage.tradewise_user = null;
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};

const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};

// Auth API functions
const authAPI = {
  signUp: async (userData) => {
    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockUser = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email
      };
      
      const mockToken = btoa(JSON.stringify({
        exp: Date.now() / 1000 + 3600 // 1 hour from now
      }));
      
      setTokens(mockToken, mockToken, mockUser);
      return { success: true, data: { user: mockUser, accessToken: mockToken, refreshToken: mockToken } };
    } catch (error) {
      console.error("Signup API error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  },

  login: async (credentials) => {
    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockUser = {
        id: Date.now(),
        firstName: "Demo",
        lastName: "User",
        email: credentials.email
      };
      
      const mockToken = btoa(JSON.stringify({
        exp: Date.now() / 1000 + 3600 // 1 hour from now
      }));
      
      setTokens(mockToken, mockToken, mockUser);
      return { success: true, data: { user: mockUser, accessToken: mockToken, refreshToken: mockToken } };
    } catch (error) {
      console.error("Login API error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  },

  logout: async () => {
    try {
      clearTokens();
      return { success: true };
    } catch (error) {
      console.error("Logout API error:", error);
      clearTokens();
      return { success: true };
    }
  },

  verifyToken: async () => {
    try {
      const token = getAccessToken();
      if (!token) return { success: false };
      
      return { success: isAuthenticated() };
    } catch (error) {
      console.error("Token verification error:", error);
      return { success: false };
    }
  },
};

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Token expiry checker
const startTokenExpiryChecker = () => {
  const checkTokenExpiry = () => {
    if (!isAuthenticated()) {
      clearTokens();
    }
  };

  setInterval(checkTokenExpiry, 60000); // Check every minute
};

// Animated background component
const AnimatedBackground = () => {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    const generateShapes = () => {
      const newShapes = [];
      for (let i = 0; i < 20; i++) {
        newShapes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 60 + 20,
          color: [
            "bg-purple-500",
            "bg-blue-500",
            "bg-pink-500",
            "bg-cyan-500",
            "bg-emerald-500",
          ][Math.floor(Math.random() * 5)],
          opacity: Math.random() * 0.3 + 0.1,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
        });
      }
      setShapes(newShapes);
    };
    generateShapes();
  }, []);

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
      <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 transform rotate-45 animate-bounce opacity-20"></div>
      <div className="absolute bottom-32 left-10 w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse opacity-30"></div>
      <div className="absolute top-1/2 right-10 w-8 h-20 bg-gradient-to-r from-emerald-400 to-blue-400 transform rotate-12 animate-pulse opacity-25"></div>
      <div className="absolute bottom-20 right-32 w-14 h-14 bg-gradient-to-r from-pink-400 to-purple-400 transform rotate-45 animate-bounce opacity-20"></div>
    </div>
  );
};

// Sign Up Form Component
const SignUpForm = ({ onClose, onSwitchToLogin, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authAPI.signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.success) {
        onSuccess(response.data.user);
        onClose();
      } else {
        alert(response.message || "Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("An error occurred during sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          disabled={loading}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-purple-600 hover:text-purple-800 font-medium"
            disabled={loading}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

// Login Form Component
const LoginForm = ({ onClose, onSwitchToSignUp, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        onSuccess(response.data.user);
        onClose();
      } else {
        alert(
          response.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          disabled={loading}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Log In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600 text-sm">Remember me</span>
            </label>
            <a
              href="#"
              className="text-purple-600 hover:text-purple-800 text-sm"
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToSignUp}
            className="text-purple-600 hover:text-purple-800 font-medium"
            disabled={loading}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = getStoredUser();
          setUser(userData);
          setIsLoggedIn(true);
          startTokenExpiryChecker();

          // Verify token with backend
          const response = await authAPI.verifyToken();
          if (!response.success) {
            clearTokens();
            setUser(null);
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearTokens();
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);

      if (response.success) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        startTokenExpiryChecker();
        return response;
      } else {
        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.signUp(userData);

      if (response.success) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        startTokenExpiryChecker();
        return response;
      } else {
        return response;
      }
    } catch (error) {
      console.error("Sign up error:", error);
      return { success: false, message: "Sign up failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearTokens();
      setUser(null);
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    signUp,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Main Landing Page Component
const TradeWiseLanding = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleStartTradingClick = () => {
    if (isLoggedIn) {
      // Simulate navigation to markets page
      alert("Navigating to Markets Dashboard... (In a real app, this would use React Router to navigate to /markets)");
    } else {
      setShowLogin(true);
    }
  };

  const handleCloseModals = () => {
    setShowSignUp(false);
    setShowLogin(false);
  };

  const handleSwitchToLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  const handleSwitchToSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  const handleAuthSuccess = (userData) => {
    alert(`Welcome ${userData.firstName}! Login successful!`);
  };

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
          <a
            href="#"
            className="text-white hover:text-purple-300 transition-colors"
          >
            Products
          </a>
          <a
            href="#"
            className="text-white hover:text-purple-300 transition-colors"
          >
            Learn
          </a>
          <a
            href="#"
            className="text-white hover:text-purple-300 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-white hover:text-purple-300 transition-colors"
          >
            Support
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-white">
                Welcome, {user?.firstName || "User"}!
              </span>
              <button
                onClick={handleStartTradingClick}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-purple-900 transition-all duration-300"
              >
                Logout
              </button>
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

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-50 mb-6 leading-tight">
            Welcome to TradeWise
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 font-light">
            Your Gateway to Smart Trading
          </p>
          <p className="text-lg text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of trading with our cutting-edge platform. Get
            real-time market insights, advanced analytics, and powerful tools
            designed to help you make informed trading decisions.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-transparent backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-amber-50 mb-2">
                Real-Time Analytics
              </h3>
              <p className="text-purple-200 text-sm">
                Advanced market analysis and live trading signals
              </p>
            </div>
            <div className="bg-transparent backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-amber-50 mb-2">
                Portfolio Management
              </h3>
              <p className="text-purple-200 text-sm">
                Track and optimize your investments with ease
              </p>
            </div>
            <div className="bg-transparent backdrop-blur-lg rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105">
              <div className="bg-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-amber-50 mb-2">
                Expert Insights
              </h3>
              <p className="text-purple-200 text-sm">
                Learn from professional traders and market experts
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={handleStartTradingClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {isLoggedIn ? "Go to Dashboard" : "Start Trading Today"}
            </button>
            {!isLoggedIn && (
              <button
                onClick={handleLoginClick}
                className="bg-gray-800 bg-opacity-50 px-8 py-3 rounded-full text-lg font-semibold hover:from-black hover:to-white text-amber-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
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
      {showSignUp && (
        <SignUpForm
          onClose={handleCloseModals}
          onSwitchToLogin={handleSwitchToLogin}
          onSuccess={handleAuthSuccess}
        />
      )}
      {showLogin && (
        <LoginForm
          onClose={handleCloseModals}
          onSwitchToSignUp={handleSwitchToSignUp}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

// Export with AuthProvider wrapper
const App = () => {
  return (
    <AuthProvider>
      <TradeWiseLanding />
    </AuthProvider>
  );
};

export default App;