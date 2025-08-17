//controler/authControler.js
const User = require("../models/User")
const authService = require("../services/authService")

// Sign Up Controller 
const signUp = async (req, res) => {
  try {
    console.log("🚀 CONTROLLER: Sign up request body:", req.body)

    const { firstName, lastName, email, password } = req.body

    // Simple check for required fields (no express-validator)
    if (!firstName || !lastName || !email || !password) {
      console.log("❌ CONTROLLER: Missing required fields")
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        source: "controller basic check",
      })
    }

    console.log("✅ CONTROLLER: All fields present, calling authService...")

    // Use the auth service
    const result = await authService.registerUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
    })

    console.log("📧 CONTROLLER: AuthService result:", result)

    if (result.success) {
      return res.status(201).json(result)
    } else {
      const statusCode = result.code === "USER_EXISTS" ? 409 : 400
      return res.status(statusCode).json(result)
    }
  } catch (error) {
    console.error("❌ CONTROLLER: Sign up error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error during sign up",
      source: "controller error handler",
    })
  }
}

// Login Controller - NO VALIDATION
const login = async (req, res) => {
  try {
    console.log("🚀 CONTROLLER: Login request body:", req.body)

    const { email, password } = req.body

    // Simple check for required fields (no express-validator)
    if (!email || !password) {
      console.log("❌ CONTROLLER: Missing email or password")
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
        source: "controller basic check",
      })
    }

    console.log("✅ CONTROLLER: Credentials present, calling authService...")

    // Use the auth service
    const result = await authService.loginUser({
      email: email.trim().toLowerCase(),
      password,
    })

    console.log("📧 CONTROLLER: AuthService result:", result)

    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(401).json(result)
    }
  } catch (error) {
    console.error("❌ CONTROLLER: Login error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
      source: "controller error handler",
    })
  }
}

// Refresh Token Controller
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      })
    }

    // Verify refresh token
    const jwt = require("jsonwebtoken")
    let decoded
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      })
    }

    // Find user with this refresh token
    const user = await User.findOne({
      _id: decoded.userId,
      refreshTokens: refreshToken,
      isActive: true,
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      })
    }

    // Use auth service to refresh token
    const result = await authService.refreshAccessToken(user, refreshToken)
    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(401).json(result)
    }
  } catch (error) {
    console.error("Refresh token error:", error)
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    })
  }
}

// Logout Controller
const logout = async (req, res) => {
  try {
    const { userId } = req.user
    const { refreshToken } = req.body
    const result = await authService.logoutUser(userId, refreshToken)

    return res.status(200).json(result)
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error during logout",
    })
  }
}

// Get User Profile Controller
const getProfile = async (req, res) => {
  try {
    const { userId } = req.user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Create response with firstName and lastName
    const userResponse = user.toJSON()
    const nameParts = user.name.split(" ")
    userResponse.firstName = nameParts[0] || ""
    userResponse.lastName = nameParts.slice(1).join(" ") || ""

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        user: userResponse,
      },
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching profile",
    })
  }
}

// Verify Token Controller (for frontend token validation)
const verifyToken = async (req, res) => {
  try {
    // If middleware passes, token is valid
    const { userId } = req.user

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Create response with firstName and lastName
    const userResponse = user.toJSON()
    const nameParts = user.name.split(" ")
    userResponse.firstName = nameParts[0] || ""
    userResponse.lastName = nameParts.slice(1).join(" ") || ""

    res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        user: userResponse,
      },
    })
  } catch (error) {
    console.error("Verify token error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error during token verification",
    })
  }
}

module.exports = {
  signUp,
  login,
  refreshToken,
  logout,
  getProfile,
  verifyToken,
}
