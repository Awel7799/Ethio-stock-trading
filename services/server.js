// server.js - VALIDATION VERSION

// server.js - Re-integrated Auth Routes for Login
const express = require("express")
const cors = require("cors")
const helmet = require("helmet") // Re-added helmet for security
const rateLimit = require("express-rate-limit") // Re-added rateLimit
require("dotenv").config()

console.log("🔧 Initializing server with auth routes...")

// Initialize Express app
const app = express()

// ============================================
// CRITICAL FIX: Body parsing middleware at the very top
// ============================================
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// CORS middleware
const allowedOrigins = new Set([
  "https://ethio-stock-trading.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((origin) => origin.replace(/\/+$/, ""))
    : []),
])

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true)
    }

    return callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

// ============================================
// Database Connection
// ============================================
try {
  const connectDB = require("./config/db")
  connectDB()
  console.log("✅ Database connection initiated")

  // Create wallet transaction indexes after database connection
  setTimeout(async () => {
    try {
      const WalletTransaction = require("./models/WalletTransaction")
      await WalletTransaction.createIndexes()
      console.log("✅ Wallet transaction indexes created successfully")
    } catch (error) {
      console.warn("⚠️ Could not create wallet indexes (database may not be ready):", error.message)
    }
  }, 2000)
} catch (error) {
  console.error("❌ Database connection error:", error.message)
}

// ============================================
// Load Dependencies (Auth Service, User Model, Auth Middleware)
// ============================================
console.log("🔧 Loading dependencies...")
let authService, authenticate, authenticateRefreshToken, User
try {
  authService = require("./services/authService")
  const authMiddleware = require("./middleware/authMiddleware")
  authenticate = authMiddleware // Fixed: use the main function
  authenticateRefreshToken = authMiddleware.authenticateRefreshToken // Correctly assign the refresh token middleware
  User = require("./models/User")
  console.log("✅ All dependencies loaded successfully")
} catch (error) {
  console.error("❌ Error loading dependencies:", error.message)
  // Exit if critical dependencies fail to load in production
  if (process.env.NODE_ENV === "production") {
    process.exit(1)
  }
}

// ============================================
// Security Middleware (Re-added)
// ============================================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
)

// Rate limiting (Re-added)
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

// Stricter rate limiting for auth routes (Re-added)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
})

// Apply general rate limiting to all routes
app.use(limiter)

// Trust proxy for rate limiting and IP detection
app.set("trust proxy", 1)

// ============================================
// Wallet Routes (Registered early)
// ============================================
const walletRoutes = require("./routes/wallet")
console.log("🔧 Registering wallet routes...")
app.use("/api/wallet", walletRoutes)
console.log("✅ Wallet routes registered successfully")
// === Routes ===

const stockRoutes = require("./routes/stockRoutes");
const stockDetailRoutes = require("./routes/detailStockDetailRouter");
const holdingRoutes = require("./routes/holdingRoutes");
const buyRouter = require("./routes/buyRouter");
const sellRouter = require('./routes/sellRouter');
const searchRouter = require("./routes/searchRouter");
const investmentRoutes = require("./routes/investmentRoutes");
const authRoutes = require('./routes/auth');
const chatRouter = require('./routes/chatRoutes'); 
const stockPortfolioRouter = require('./routes/stockPortfolioRouter');
const portfolioRouter = require('./routes/portfolioRouter');
const newsRoutes = require('./routes/newsRoutes.JS');

const performanceRoutes = require('./routes/performanceRoutes');

//const { runDailySnapshotJob } = require('./jobs/savePerformanceSnapshots');
//runDailySnapshotJob();


// Add these middleware
app.use('/api/auth', authLimiter, authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/stocks", stockDetailRoutes);
app.use("/api/holdings", holdingRoutes);
app.use("/api", buyRouter);
app.use('/api', sellRouter); // handles /api/sell
app.use("/api/search", searchRouter);
app.use("/api/investments", investmentRoutes);
app.use("/api/chat", chatRouter);
app.use('/api', stockPortfolioRouter);
app.use('/api', portfolioRouter);
app.use('/api/news', newsRoutes);
app.use('/api/performance', performanceRoutes);
// ============================================
if (process.env.NODE_ENV === "development") {
// Auth Routes (legacy development compatibility)
// ============================================
console.log("🔧 Registering auth routes...")
// Signup route
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

      // Create wallet for new user
      if (result.success && result.data?.user?.id) {
        try {
          const Wallet = require("./models/Wallet")
          const wallet = new Wallet({
            userId: result.data.user.id, // Use userId as per your Wallet model
            balance: 0,
          })
          await wallet.save()
          console.log("✅ Wallet created for new user:", result.data.user.id)
        } catch (walletError) {
          console.warn("⚠️ Could not create wallet for new user:", walletError.message)
        }
      }

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

// Login route
app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    console.log("🔐 Login request received:", req.body.email)
    const { email, password } = req.body
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
    const refreshToken = req.body.refreshToken
    const result = await authService.refreshAccessToken(req.user, refreshToken)
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
}

// ============================================
// Health Check & Test Endpoints
// ============================================
// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    wallet_system: "enabled",
    ethswitch_mode: process.env.ETHSWITCH_MODE || "test",
  })
})

if (process.env.NODE_ENV === "development") {
// Development-only test and debug routes
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

// TEMPORARY: Raw Body Test Route (Confirmed Working)
app.post("/api/debug/raw-body-test", (req, res) => {
  console.log("--- RAW BODY TEST ROUTE HIT ---")
  console.log("Request Headers:", req.headers)
  console.log("Request Body:", req.body)
  res.json({
    success: true,
    message: "Raw body test received!",
    receivedBody: req.body,
    receivedHeaders: req.headers,
  })
})

// ============================================
// Debug Endpoints (Existing)
// ============================================
// TEMPORARY: Delete user by email endpoint
app.delete("/api/debug/delete-user/:email", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim()
    console.log("🗑️ DEBUG: Attempting to delete user with email:", email)
    const User = require("./models/User")
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
    try {
      const Wallet = require("./models/Wallet")
      const WalletTransaction = require("./models/WalletTransaction")

      await Wallet.deleteMany({ userId: user._id }) // Use userId as per your Wallet model
      await WalletTransaction.deleteMany({ userId: user._id }) // Use userId as per your WalletTransaction model
      console.log("🗑️ DEBUG: Deleted user's wallet and transactions")
    } catch (walletError) {
      console.warn("⚠️ Could not delete wallet data:", walletError.message)
    }
    const deleteResult = await User.deleteOne({ email })
    console.log("🗑️ DEBUG: Delete result:", deleteResult)
    res.json({
      success: true,
      message: "User and associated wallet data deleted successfully",
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
}

// ============================================
// Global Error Handling
// ============================================
app.use((error, req, res, next) => {
  console.error("Global error handler:", error)
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({ success: false, message: "CORS policy violation", code: "CORS_ERROR" });
  }
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ success: false, message: "Invalid JSON", code: "INVALID_JSON" });
  }
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
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found`, code: "ROUTE_NOT_FOUND" });
});

// ============================================
// Server Startup
// ============================================
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`💳 Wallet Mode: ${process.env.ETHSWITCH_MODE || "test"}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/health`)
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`)
  console.log(`🔗 Allowed origins: ${Array.from(allowedOrigins).join(", ")}`)

  if (process.env.NODE_ENV === "development") {
    console.log(`💰 Wallet API docs: http://localhost:${PORT}/api/wallet/docs`)
    console.log(`🏦 Supported banks: http://localhost:${PORT}/api/wallet/banks`)
  }

  console.log("=".repeat(50))
})

// Handle server errors
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`)
  } else {
    console.error("❌ Server error:", error)
  }
  process.exit(1)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...")
  server.close(() => {
    console.log("✅ Process terminated")
    process.exit(0)
  })
})

process.on("SIGINT", () => {
  console.log("\n👋 SIGINT received. Shutting down gracefully...")
  server.close(() => {
    console.log("✅ Process terminated")
    process.exit(0)
  })
})

module.exports = app;
