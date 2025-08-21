// api/auth.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"

// Token keys
const TOKEN_KEY = "tradewise_access_token"
const REFRESH_TOKEN_KEY = "tradewise_refresh_token"
const USER_KEY = "tradewise_user"

// Rate limiting storage
const RATE_LIMIT_KEY = "tradewise_rate_limit"

// Rate limiting helper functions
const getRateLimitData = () => {
  try {
    const data = localStorage.getItem(RATE_LIMIT_KEY)
    return data ? JSON.parse(data) : { attempts: [], lastAttempt: null }
  } catch (error) {
    return { attempts: [], lastAttempt: null }
  }
}

const setRateLimitData = (data) => {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error storing rate limit data:", error)
  }
}

const isRateLimited = () => {
  const rateLimitData = getRateLimitData()
  const now = Date.now()
  const fiveMinutesAgo = now - (5 * 60 * 1000) // 5 minutes window
  
  // Filter recent attempts within the last 5 minutes
  const recentAttempts = rateLimitData.attempts.filter(attempt => attempt > fiveMinutesAgo)
  
  // Update the attempts array
  rateLimitData.attempts = recentAttempts
  setRateLimitData(rateLimitData)
  
  // Check if user has made too many attempts (3 or more in 5 minutes)
  return recentAttempts.length >= 3
}

const recordLoginAttempt = () => {
  const rateLimitData = getRateLimitData()
  const now = Date.now()
  rateLimitData.attempts.push(now)
  rateLimitData.lastAttempt = now
  setRateLimitData(rateLimitData)
}

const getRemainingCooldown = () => {
  const rateLimitData = getRateLimitData()
  if (!rateLimitData.lastAttempt) return 0
  
  const now = Date.now()
  const cooldownPeriod = 5 * 60 * 1000 // 5 minutes
  const timeSinceLastAttempt = now - rateLimitData.lastAttempt
  
  return Math.max(0, cooldownPeriod - timeSinceLastAttempt)
}

// Token Getters
export const getAccessToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (error) {
    console.error("Error getting access token:", error)
    return null
  }
}

export const getRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch (error) {
    console.error("Error getting refresh token:", error)
    return null
  }
}

export const getUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

// Token Setters
export const setTokens = (accessToken, refreshToken, user) => {
  try {
    if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch (error) {
    console.error("Error storing tokens:", error)
  }
}

export const clearTokens = () => {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch (error) {
    console.error("Error clearing tokens:", error)
  }
}

// Unified request function
const apiRequest = async (url, options = {}) => {
  const accessToken = getAccessToken()

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    console.log(`🔄 Making API request to: ${API_BASE_URL}${url}`)
    console.log('📡 Request config:', config)
    
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    
    console.log(`📊 Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      console.log('❌ Response data:', data)

      // Handle rate limiting (429 status)
      if (response.status === 429) {
        console.log('⏳ Rate limit exceeded, handling gracefully...')
        return { 
          success: false, 
          message: data.message || 'Too many requests. Please wait before trying again.',
          code: 'RATE_LIMIT_EXCEEDED',
          rateLimited: true
        }
      }

      // Handle token expiration
      if (response.status === 401) {
        if (data.code === "TOKEN_EXPIRED" || (data.message && data.message.includes("expired"))) {
          console.log('🔄 Token expired, attempting refresh...')
          const refreshToken = getRefreshToken()
          if (refreshToken) {
            try {
              const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
              })

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json()
                console.log('✅ Token refreshed successfully')
                setTokens(refreshData.data.accessToken, refreshData.data.refreshToken, getUser())

                // Retry original request
                config.headers.Authorization = `Bearer ${refreshData.data.accessToken}`
                const retryResponse = await fetch(`${API_BASE_URL}${url}`, config)
                const retryData = await retryResponse.json()
                console.log('✅ Retry request successful')
                return retryData
              }
            } catch (err) {
              console.error("❌ Token refresh error:", err)
            }

            console.log('🚪 Clearing tokens and redirecting...')
            clearTokens()
            window.location.href = "/"
            return { success: false, message: "Session expired" }
          } else {
            console.log('❌ No refresh token available')
            clearTokens()
            window.location.href = "/"
            return { success: false, message: "No refresh token available" }
          }
        }

        return { success: false, message: data.message || "Unauthorized" }
      }

      return { success: false, message: data.message || `HTTP ${response.status}` }
    }

    const responseData = await response.json()
    console.log('✅ API request successful:', responseData)
    return responseData
  } catch (error) {
    console.error("❌ API request failed:", error)

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        success: false,
        message: `Cannot connect to server at ${API_BASE_URL}. Please check if your backend server is running.`,
      }
    }

    return { success: false, message: "Network error. Please check your connection and try again." }
  }
}

// Auth API
export const authAPI = {
  signUp: async (userData) => {
    try {
      console.log('📝 Attempting sign up...')
      const response = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      })

      if (response.success) {
        console.log('✅ Sign up successful')
        const accessToken = response.token || response.data?.accessToken
        const refreshToken = response.data?.refreshToken
        const user = response.user || response.data?.user

        setTokens(accessToken, refreshToken, user)
      }

      return response
    } catch (error) {
      console.error("❌ Sign up error:", error)
      return { success: false, message: "Sign up failed" }
    }
  },

  login: async (credentials) => {
    try {
      console.log('🔐 Attempting login...')
      
      // Check client-side rate limiting before making request
      if (isRateLimited()) {
        const remainingTime = getRemainingCooldown()
        const minutes = Math.ceil(remainingTime / (60 * 1000))
        console.log('⏳ Client-side rate limit active, blocking request')
        return { 
          success: false, 
          message: `Too many login attempts. Please wait ${minutes} minute(s) before trying again.`,
          code: 'CLIENT_RATE_LIMIT',
          rateLimited: true
        }
      }

      // Record this login attempt
      recordLoginAttempt()

      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      })

      if (response.success) {
        console.log('✅ Login successful')
        // Clear rate limit data on successful login
        localStorage.removeItem(RATE_LIMIT_KEY)
        
        const accessToken = response.token || response.data?.accessToken
        const refreshToken = response.data?.refreshToken
        const user = response.user || response.data?.user

        setTokens(accessToken, refreshToken, user)
      }

      return response
    } catch (error) {
      console.error("❌ Login error:", error)
      return { success: false, message: "Login failed" }
    }
  },

  logout: async () => {
    try {
      console.log('🚪 Attempting logout...')
      const refreshToken = getRefreshToken()
      
      await apiRequest("/auth/logout", { 
        method: "POST",
        body: JSON.stringify({ refreshToken }) // Include refresh token in logout
      })
    } catch (error) {
      console.error("❌ Logout error:", error)
    } finally {
      console.log('🧹 Clearing tokens...')
      clearTokens()
      return { success: true }
    }
  },

  getProfile: async () => {
    console.log('👤 Fetching profile...')
    return await apiRequest("/auth/profile")
  },

  verifyToken: async () => {
    console.log('🔍 Verifying token...')
    return await apiRequest("/auth/verify-token")
  },

  refreshToken: async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      console.log('❌ No refresh token available')
      return { success: false, message: "No refresh token available" }
    }

    try {
      console.log('🔄 Refreshing token...')
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        console.log('✅ Token refreshed successfully')
        setTokens(data.data.accessToken, data.data.refreshToken, getUser())
        return data
      } else {
        console.log('❌ Token refresh failed:', data.message)
        clearTokens()
        return { success: false, message: data.message || "Token refresh failed" }
      }
    } catch (error) {
      console.error("❌ Token refresh error:", error)
      clearTokens()
      return { success: false, message: "Token refresh failed" }
    }
  },
}

// Auto Token Expiry Check
export const startTokenExpiryChecker = () => {
  const checkTokenExpiry = () => {
    const accessToken = getAccessToken()
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]))
        const currentTime = Date.now() / 1000

        // Check if token expires in less than 5 minutes
        if (payload.exp - currentTime < 300) {
          console.log('⚠️ Token expiring soon, refreshing...')
          const refreshToken = getRefreshToken()
          if (refreshToken) {
            authAPI.refreshToken()
          } else {
            console.log('❌ No refresh token, clearing auth state')
            clearTokens()
            window.location.href = "/"
          }
        }
      } catch (error) {
        console.error("❌ Token parsing error:", error)
        clearTokens()
        window.location.href = "/"
      }
    }
  }

  checkTokenExpiry()
  setInterval(checkTokenExpiry, 60000) // Check every 1 minute
}

export const isAuthenticated = () => {
  const token = getAccessToken()
  const user = getUser()

  if (!token || !user) {
    console.log('❌ No token or user data found')
    return false
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const isValid = payload.exp > Date.now() / 1000
    console.log(`🔍 Token validation: ${isValid ? 'Valid' : 'Expired'}`)
    return isValid
  } catch (error) {
    console.error("❌ Token validation error:", error)
    return false
  }
}

// Legacy compatibility functions
export const getUserData = getUser
export const setUserData = (userData) => setTokens(getAccessToken(), getRefreshToken(), userData)
export const removeUserData = clearTokens
export const setAccessToken = (token) => setTokens(token, getRefreshToken(), getUser())
export const removeAccessToken = clearTokens