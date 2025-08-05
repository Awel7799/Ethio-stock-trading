// server.js - VALIDATION VERSION

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

console.log("🔧 Initializing server...")

// Initialize Express app
const app = express()

// Connect to database with error handling
try {
  const connectDB = require("./config/db")
  connectDB()
  console.log("✅ Database connection initiated")
} catch (error) {
  console.error("❌ Database connection error:", error.message)
}

// Load dependencies
console.log("🔧 Loading dependencies...")
let authService, authenticate, authenticateRefreshToken, User
try {
  authService = require("./services/authService")
  const authMiddleware = require("./middleware/auth")
  authenticate = authMiddleware.authenticate
  authenticateRefreshToken = authMiddleware.authenticateRefreshToken
  User = require("./models/User")
  console.log("✅ All dependencies loaded successfully")
} catch (error) {
  console.error("❌ Error loading dependencies:", error.message)
}

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
})

// Apply rate limiting to all routes
app.use(limiter)

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173", // Vite default port
      "http://127.0.0.1:5173", // Alternative localhost
    ]

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log("CORS blocked origin:", origin)
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}

app.use(cors(corsOptions))

// Handle preflight requests
app.options("*", cors(corsOptions))

// Additional CORS headers middleware
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.url}`)

  res.header("Access-Control-Allow-Origin", "http://localhost:5173")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.header("Access-Control-Allow-Credentials", "true")

  if (req.method === "OPTIONS") {
    console.log("✅ Handling OPTIONS preflight request")
    return res.sendStatus(200)
  }

  next()
})

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Basic routing works!" })
})

app.get("/api/test", (req, res) => {
  console.log("🧪 Test route hit!")
  res.json({
    success: true,
    message: "Server is working!",
    timestamp: new Date().toISOString(),
  })
})

// Test signup route
app.post("/api/test-signup", (req, res) => {
  console.log("🧪 TEST SIGNUP ROUTE HIT!")
  console.log("Request body:", req.body)

  res.json({
    success: true,
    message: "Test route working!",
    receivedData: req.body,
  })
})

// Auth Routes - VALIDATION
console.log("🔧 Registering auth routes...")

// Signup route - VALIDATION
app.post("/api/auth/signup", authLimiter, async (req, res) => {
  console.log("🚀 SIGNUP ROUTE HIT IN SERVER.JS!")
  console.log("📧 Request body:", JSON.stringify(req.body, null, 2))

  try {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
      console.log("❌ Missing fields in server.js")
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        source: "server.js validation",
      })
    }

    console.log("✅ All fields present, calling authService.registerUser...")

    if (authService) {
      console.log("📧 Calling authService.registerUser with:", { firstName, lastName, email })
      const result = await authService.registerUser(req.body)
      console.log("📧 AuthService result:", result)
      const statusCode = result.success ? 201 : 400
      res.status(statusCode).json(result)
    } else {
      console.log("⚠️ AuthService not available, returning test response")
      res.status(201).json({
        success: true,
        message: "User created successfully!",
        source: "server.js fallback",
        data: {
          user: { firstName, lastName, email, id: "test-user-123" },
          accessToken: "test-token-123",
          refreshToken: "test-refresh-123",
        },
        token: "test-token-123",
        user: { firstName, lastName, email, id: "test-user-123" },
      })
    }
  } catch (error) {
    console.error("❌ Signup route error in server.js:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error during registration.",
      source: "server.js error handler",
      error: error.message,
    })
  }
})

// Login route - VALIDATION
app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    console.log("🔐 Login request received:", req.body.email)

    const { email, password } = req.body

    // Simple check for required fields (no validation)
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    const result = await authService.loginUser(req.body)
    const statusCode = result.success ? 200 : 401
    res.status(statusCode).json(result)
  } catch (error) {
    console.error("Login route error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error during login.",
      code: "SERVER_ERROR",
    })
  }
})

// Refresh token route
app.post("/api/auth/refresh-token", authLimiter, authenticateRefreshToken, async (req, res) => {
  try {
    const result = await authService.refreshAccessToken(req.user, req.refreshToken)
    const statusCode = result.success ? 200 : 401
    res.status(statusCode).json(result)
  } catch (error) {
    console.error("Refresh token route error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error during token refresh.",
      code: "SERVER_ERROR",
    })
  }
})

// Logout route
app.post("/api/auth/logout", authLimiter, authenticate, async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken
    const result = await authService.logoutUser(req.user.id, refreshToken)
    res.status(200).json(result)
  } catch (error) {
    console.error("Logout route error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error during logout.",
      code: "SERVER_ERROR",
    })
  }
})

// Logout all devices route
app.post("/api/auth/logout-all", authLimiter, authenticate, async (req, res) => {
  try {
    const result = await authService.logoutAllDevices(req.user.id)
    res.status(200).json(result)
  } catch (error) {
    console.error("Logout all route error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error during logout from all devices.",
      code: "SERVER_ERROR",
    })
  }
})

// Profile route
app.get("/api/auth/profile", authLimiter, authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
        code: "USER_NOT_FOUND",
      })
    }
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully.",
      data: {
        user: user.toJSON(),
      },
    })
  } catch (error) {
    console.error("Profile route error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching profile.",
      code: "SERVER_ERROR",
    })
  }
})

// Verify token route
app.get("/api/auth/verify-token", authLimiter, authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token is valid.",
    data: {
      user: req.user,
    },
  })
})

console.log("✅ All auth routes registered successfully")

// TEMPORARY: Debug endpoints
// TEMPORARY: Delete user by email endpoint
app.delete("/api/debug/delete-user/:email", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim()
    console.log("🗑️ DEBUG: Attempting to delete user with email:", email)

    const User = require("./models/User")

    // Find the user first
    const user = await User.findOne({ email })
    if (!user) {
      console.log("❌ DEBUG: No user found with email:", email)
      return res.json({
        success: false,
        message: "User not found",
        email: email,
      })
    }

    console.log("🔍 DEBUG: Found user to delete:")
    console.log("  - ID:", user._id)
    console.log("  - Email:", user.email)
    console.log("  - Name:", user.name)

    // Delete the user
    const deleteResult = await User.deleteOne({ email })
    console.log("🗑️ DEBUG: Delete result:", deleteResult)

    res.json({
      success: true,
      message: "User deleted successfully",
      deletedUser: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      deleteResult,
    })
  } catch (error) {
    console.error("❌ DEBUG: Error deleting user:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    })
  }
})

// TEMPORARY: List all users endpoint
app.get("/api/debug/list-users", async (req, res) => {
  try {
    const User = require("./models/User")

    const users = await User.find({}).select("email name firstName lastName createdAt")
    console.log("📋 DEBUG: Found", users.length, "users in database")

    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ID: ${user._id}, Email: "${user.email}", Name: "${user.name}"`)
    })

    res.json({
      success: true,
      message: `Found ${users.length} users`,
      users: users.map((user) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      })),
    })
  } catch (error) {
    console.error("❌ DEBUG: Error listing users:", error)
    res.status(500).json({
      success: false,
      message: "Error listing users",
      error: error.message,
    })
  }
})

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error)

  // Handle CORS errors
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy violation",
      code: "CORS_ERROR",
    })
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
      code: "INVALID_JSON",
    })
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
    ...(process.env.NODE_ENV === "development" && {
      error: error.message,
      stack: error.stack,
    }),
  })
})

// Catch undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    code: "ROUTE_NOT_FOUND",
  })
})

// Start server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/health`)
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`)
  console.log(`🔗 Allowed origins: http://localhost:5173, http://localhost:3000`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...")
  server.close(() => {
    console.log("✅ Process terminated")
  })
})

module.exports = app
