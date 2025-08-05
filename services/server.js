
// === Unified server.js ===

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();
console.log("🔧 Initializing server...");

const app = express();

// === Database Connection ===
try {
  const connectDB = require("./config/db");
  connectDB();
  console.log("✅ Database connection initiated");
} catch (error) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// === Middleware ===
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
app.options("*", cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests", code: "RATE_LIMIT_EXCEEDED" },
  standardHeaders: true,
  legacyHeaders: false
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// === Routes ===
const stockRoutes = require("./routes/stockRoutes");
const stockDetailRoutes = require("./routes/detailStockDetailRouter");
const holdingRoutes = require("./routes/holdingRoutes");
const buyRouter = require("./routes/buyRouter");
const searchRouter = require("./routes/searchRouter");
const investmentRoutes = require("./routes/investmentRoutes");
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/stocks", stockDetailRoutes);
app.use("/api/holdings", holdingRoutes);
app.use("/api", buyRouter);
app.use("/api/search", searchRouter);
app.use("/api/investments", investmentRoutes);

// === Auth Routes ===
let authService, authenticate, authenticateRefreshToken, User;
try {
  authService = require("./services/authService");
  const authMiddleware = require("./middleware/auth");
  authenticate = authMiddleware.authenticate;
  authenticateRefreshToken = authMiddleware.authenticateRefreshToken;
  User = require("./models/User");
  console.log("✅ Auth dependencies loaded");
} catch (error) {
  console.error("❌ Auth dependency loading error:", error.message);
}

// Add auth routes if loaded (copy from second file, skipped for brevity here)

// === Health & Test Endpoints ===
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "OK", timestamp: new Date().toISOString() });
});
app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint working!" });
});

// === Error Handling ===
app.use((error, req, res, next) => {
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({ success: false, message: "CORS policy violation", code: "CORS_ERROR" });
  }
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ success: false, message: "Invalid JSON", code: "INVALID_JSON" });
  }
  res.status(500).json({ success: false, message: "Internal server error", code: "INTERNAL_ERROR", error: error.message });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found`, code: "ROUTE_NOT_FOUND" });
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down...");
  server.close(() => console.log("✅ Server closed gracefully"));
});

module.exports = app;
