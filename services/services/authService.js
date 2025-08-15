//services/services/authService.js
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const mongoose = require("mongoose")

class AuthService {
  // Generate JWT tokens
  generateTokens(userId) {
    const accessToken = jwt.sign({ userId, type: "access" }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "3h",
    })
    const refreshToken = jwt.sign({ userId, type: "refresh" }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
    })
    return { accessToken, refreshToken }
  }

  // Register new user - WITH DETAILED DATABASE DEBUGGING
  async registerUser(userData) {
    try {
      console.log("🚀 AUTHSERVICE: Starting user registration...")

      // DETAILED DATABASE CONNECTION INFO
      console.log("🔍 DATABASE CONNECTION DETAILS:")
      console.log("  - Connection State:", mongoose.connection.readyState)
      console.log("  - Database Host:", mongoose.connection.host)
      console.log("  - Database Port:", mongoose.connection.port)
      console.log("  - Database Name:", mongoose.connection.db?.databaseName)
      console.log("  - Collection Name:", User.collection.name)
      console.log("  - Connection String (partial):", process.env.DATABASE_URL?.substring(0, 50) + "...")

      // Check if we're connected to Atlas or local
      const isAtlas = mongoose.connection.host?.includes("mongodb.net") || mongoose.connection.host?.includes("atlas")
      console.log("  - Is MongoDB Atlas?", isAtlas ? "YES" : "NO (LOCAL)")

      const { firstName, lastName, email, password } = userData
      const fullName = `${firstName} ${lastName}`.trim()
      const emailToCheck = email.toLowerCase().trim()

      console.log("🔍 AUTHSERVICE: Checking for existing user...")
      const existingUser = await User.findOne({ email: emailToCheck })

      if (existingUser) {
        console.log("❌ AUTHSERVICE: User already exists")
        return {
          success: false,
          message: "User with this email already exists.",
          code: "USER_EXISTS",
        }
      }

      console.log("✅ AUTHSERVICE: No existing user found, creating new user...")

      // Create user data
      const userData_to_save = {
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: emailToCheck,
        password,
      }

      console.log("📧 AUTHSERVICE: User data to save:", {
        ...userData_to_save,
        password: "[HIDDEN]",
      })

      const user = new User(userData_to_save)

      console.log("💾 AUTHSERVICE: Attempting to save user to database...")
      console.log("  - Target Database:", mongoose.connection.db?.databaseName)
      console.log("  - Target Collection:", User.collection.name)
      console.log("  - Full Collection Path:", `${mongoose.connection.db?.databaseName}.${User.collection.name}`)

      // Save user
      const savedUser = await user.save()

      console.log("✅ AUTHSERVICE: User saved successfully!")
      console.log("  - Saved User ID:", savedUser._id)
      console.log("  - Saved to Database:", mongoose.connection.db?.databaseName)
      console.log("  - Saved to Collection:", User.collection.name)

      // VERIFY THE USER WAS ACTUALLY SAVED
      console.log("🔍 AUTHSERVICE: Verifying user was saved...")
      const verifyUser = await User.findById(savedUser._id)
      if (verifyUser) {
        console.log("✅ AUTHSERVICE: User verification successful!")
        console.log("  - Verified User Email:", verifyUser.email)
        console.log("  - Verified User Name:", verifyUser.name)
      } else {
        console.log("❌ AUTHSERVICE: User verification FAILED - user not found after save!")
      }

      // COUNT TOTAL USERS IN COLLECTION
      const totalUsers = await User.countDocuments()
      console.log("📊 AUTHSERVICE: Total users in collection after save:", totalUsers)

      // LIST ALL USERS (for debugging)
      const allUsers = await User.find({}).select("email name").limit(5)
      console.log("📋 AUTHSERVICE: Recent users in collection:")
      allUsers.forEach((u, index) => {
        console.log(`  ${index + 1}. ${u.email} - ${u.name}`)
      })

      // Generate tokens
      console.log("🔑 AUTHSERVICE: Generating tokens...")
      const { accessToken, refreshToken } = this.generateTokens(savedUser._id)

      // Save refresh token
      console.log("💾 AUTHSERVICE: Saving refresh token...")
      await savedUser.addRefreshToken(refreshToken)

      // Create response
      const userResponse = savedUser.toJSON()
      userResponse.firstName = firstName
      userResponse.lastName = lastName

      console.log("✅ AUTHSERVICE: Registration completed successfully")

      return {
        success: true,
        message: "User registered successfully.",
        data: {
          user: userResponse,
          accessToken,
          refreshToken,
        },
        token: accessToken,
        user: userResponse,
      }
    } catch (error) {
      console.error("❌ AUTHSERVICE: Registration error occurred:")
      console.error("❌ AUTHSERVICE: Error name:", error.name)
      console.error("❌ AUTHSERVICE: Error message:", error.message)
      console.error("❌ AUTHSERVICE: Error stack:", error.stack)

      // Handle validation errors
      if (error.name === "ValidationError") {
        const errorMessages = Object.values(error.errors).map((err) => err.message)
        return {
          success: false,
          message: errorMessages.join(". "),
          code: "VALIDATION_ERROR",
        }
      }

      // Handle duplicate key error
      if (error.code === 11000) {
        return {
          success: false,
          message: "User with this email already exists.",
          code: "USER_EXISTS",
        }
      }

      return {
        success: false,
        message: `Registration failed: ${error.message}`,
        code: "REGISTRATION_ERROR",
      }
    }
  }

  // Login user - WITH DATABASE DEBUGGING
  async loginUser(credentials) {
    try {
      console.log("🔐 AUTHSERVICE: Starting login process...")

      // DATABASE INFO
      console.log("🔍 DATABASE INFO:")
      console.log("  - Database Name:", mongoose.connection.db?.databaseName)
      console.log("  - Collection Name:", User.collection.name)

      const { email, password } = credentials
      const emailToCheck = email.toLowerCase().trim()

      console.log("🔍 AUTHSERVICE: Searching for user with email:", emailToCheck)

      const user = await User.findOne({
        email: emailToCheck,
        isActive: true,
      }).select("+password")

      if (!user) {
        console.log("❌ AUTHSERVICE: No user found")

        // Count total users for debugging
        const totalUsers = await User.countDocuments()
        console.log("📊 AUTHSERVICE: Total users in collection:", totalUsers)

        return {
          success: false,
          message: "Invalid email or password.",
          code: "INVALID_CREDENTIALS",
        }
      }

      console.log("✅ AUTHSERVICE: User found for login")
      console.log("  - User ID:", user._id)
      console.log("  - User Email:", user.email)

      // Check password
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        console.log("❌ AUTHSERVICE: Invalid password")
        return {
          success: false,
          message: "Invalid email or password.",
          code: "INVALID_CREDENTIALS",
        }
      }

      // Update last login
      user.lastLogin = new Date()
      await user.save()

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user._id)
      await user.addRefreshToken(refreshToken)

      // Create response
      const userResponse = user.toJSON()
      const nameParts = user.name.split(" ")
      userResponse.firstName = user.firstName || nameParts[0] || ""
      userResponse.lastName = user.lastName || nameParts.slice(1).join(" ") || ""

      console.log("✅ AUTHSERVICE: Login successful")

      return {
        success: true,
        message: "Login successful.",
        data: {
          user: userResponse,
          accessToken,
          refreshToken,
        },
        token: accessToken,
        user: userResponse,
      }
    } catch (error) {
      console.error("❌ AUTHSERVICE: Login error:", error)
      return {
        success: false,
        message: "Login failed. Please try again.",
        code: "LOGIN_ERROR",
      }
    }
  }

  // Other methods remain the same...
  async refreshAccessToken(user, oldRefreshToken) {
    try {
      const { accessToken, refreshToken } = this.generateTokens(user._id)
      await user.removeRefreshToken(oldRefreshToken)
      await user.addRefreshToken(refreshToken)
      return {
        success: true,
        message: "Token refreshed successfully.",
        data: { accessToken, refreshToken },
      }
    } catch (error) {
      console.error("Token refresh error:", error)
      return { success: false, message: "Token refresh failed.", code: "REFRESH_ERROR" }
    }
  }

  async logoutUser(userId, refreshToken) {
    try {
      const user = await User.findById(userId)
      if (user && refreshToken) {
        await user.removeRefreshToken(refreshToken)
      }
      return { success: true, message: "Logout successful." }
    } catch (error) {
      console.error("Logout error:", error)
      return { success: false, message: "Logout failed.", code: "LOGOUT_ERROR" }
    }
  }

  async logoutAllDevices(userId) {
    try {
      const user = await User.findById(userId)
      if (user) {
        await user.removeAllRefreshTokens()
      }
      return { success: true, message: "Logged out from all devices successfully." }
    } catch (error) {
      console.error("Logout all devices error:", error)
      return { success: false, message: "Logout from all devices failed.", code: "LOGOUT_ALL_ERROR" }
    }
  }
}

module.exports = new AuthService()
