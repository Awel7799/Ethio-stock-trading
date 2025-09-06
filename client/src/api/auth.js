// api/auth.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"

// Token keys
const TOKEN_KEY = "tradewise_access_token"
const REFRESH_TOKEN_KEY = "tradewise_refresh_token"
const USER_KEY = "tradewise_user"

// Rate limiting variables
let requestCount = 0
let requestWindowStart = Date.now()
const MAX_REQUESTS_PER_MINUTE = 30 // Adjust based on your API limits
const WINDOW_SIZE_MS = 60000 // 1 minute

// Request queue for rate limiting
let requestQueue = []
let isProcessingQueue = false

// Sleep utility function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Rate limiting helper
const checkRateLimit = async () => {
  const now = Date.now()
  
  // Reset window if needed
  if (now - requestWindowStart >= WINDOW_SIZE_MS) {
    requestCount = 0
    requestWindowStart = now
  }
  
  // If we've hit the limit, wait
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    const waitTime = WINDOW_SIZE_MS - (now - requestWindowStart)
    console.warn(`⚠️ Rate limit reached. Waiting ${waitTime}ms...`)
    await sleep(waitTime)
    requestCount = 0
    requestWindowStart = Date.now()
  }
  
  requestCount++
}

// Exponential backoff retry utility
const withRetry = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxRetries) throw error
      
      // Don't retry on 4xx errors (except 429)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000
      console.log(`⚠️ Request failed (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`)
      await sleep(delay)
    }
  }
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

// Track ongoing refresh attempts to prevent multiple simultaneous refreshes
let isRefreshing = false
let refreshPromise = null

// Unified request function with rate limiting and proper error handling
const apiRequest = async (url, options = {}) => {
  // Apply rate limiting
  await checkRateLimit()
  
  const accessToken = getAccessToken()

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  }

  return await withRetry(async () => {
    console.log(`🔄 Making API request to: ${API_BASE_URL}${url}`)
    
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    
    console.log(`📊 Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`)
      error.status = response.status
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000
        console.warn(`⚠️ Rate limited by server. Waiting ${waitTime}ms...`)
        await sleep(waitTime)
        throw error // This will trigger a retry
      }

      const data = await response.json().catch(() => ({}))
      console.log('❌ Response data:', data)

      // Handle token expiration
      if (response.status === 401) {
        if (data.code === "TOKEN_EXPIRED" || (data.message && data.message.includes("expired"))) {
          console.log('🔄 Token expired, attempting refresh...')
          
          // Prevent multiple simultaneous refresh attempts
          if (isRefreshing && refreshPromise) {
            await refreshPromise
            // Retry with potentially new token
            const newToken = getAccessToken()
            if (newToken !== accessToken) {
              config.headers.Authorization = `Bearer ${newToken}`
              const retryResponse = await fetch(`${API_BASE_URL}${url}`, config)
              return await retryResponse.json()
            }
          }
          
          if (!isRefreshing) {
            isRefreshing = true
            refreshPromise = handleTokenRefresh()
            
            try {
              const refreshResult = await refreshPromise
              if (refreshResult.success) {
                // Retry original request with new token
                config.headers.Authorization = `Bearer ${refreshResult.accessToken}`
                const retryResponse = await fetch(`${API_BASE_URL}${url}`, config)
                const retryData = await retryResponse.json()
                console.log('✅ Retry request successful')
                return retryData
              }
            } finally {
              isRefreshing = false
              refreshPromise = null
            }
          }
          
          return { success: false, message: "Session expired" }
        }

        return { success: false, message: data.message || "Unauthorized" }
      }

      return { success: false, message: data.message || `HTTP ${response.status}` }
    }

    const responseData = await response.json()
    console.log('✅ API request successful:', responseData)
    return responseData
  }, 3, 1000)
}

// Separate token refresh handler to avoid recursion
const handleTokenRefresh = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    console.log('❌ No refresh token available')
    clearTokens()
    window.location.href = "/"
    return { success: false, message: "No refresh token available" }
  }

  try {
    console.log('🔄 Refreshing token...')
    await checkRateLimit() // Apply rate limiting to refresh requests too
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After')
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000
      console.warn(`⚠️ Token refresh rate limited. Waiting ${waitTime}ms...`)
      await sleep(waitTime)
      throw new Error('Rate limited')
    }

    const data = await response.json()

    if (response.ok && data.success) {
      console.log('✅ Token refreshed successfully')
      setTokens(data.data.accessToken, data.data.refreshToken, getUser())
      return { success: true, accessToken: data.data.accessToken }
    } else {
      console.log('❌ Token refresh failed:', data.message)
      clearTokens()
      window.location.href = "/"
      return { success: false, message: data.message || "Token refresh failed" }
    }
  } catch (error) {
    console.error("❌ Token refresh error:", error)
    if (error.message !== 'Rate limited') {
      clearTokens()
      window.location.href = "/"
    }
    return { success: false, message: "Token refresh failed" }
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
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      })

      if (response.success) {
        console.log('✅ Login successful')
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
        body: JSON.stringify({ refreshToken })
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
    if (isRefreshing && refreshPromise) {
      return await refreshPromise
    }
    
    isRefreshing = true
    refreshPromise = handleTokenRefresh()
    
    try {
      return await refreshPromise
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  },
}

// Less aggressive token expiry checker
let tokenExpiryInterval = null

export const startTokenExpiryChecker = () => {
  // Clear any existing interval
  if (tokenExpiryInterval) {
    clearInterval(tokenExpiryInterval)
  }

  const checkTokenExpiry = async () => {
    const accessToken = getAccessToken()
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]))
        const currentTime = Date.now() / 1000

        // Check if token expires in less than 5 minutes
        if (payload.exp - currentTime < 300) {
          console.log('⚠️ Token expiring soon, refreshing...')
          const refreshToken = getRefreshToken()
          if (refreshToken && !isRefreshing) {
            await authAPI.refreshToken()
          } else if (!refreshToken) {
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
  // Reduced frequency: check every 5 minutes instead of 1 minute
  tokenExpiryInterval = setInterval(checkTokenExpiry, 300000)
}

export const stopTokenExpiryChecker = () => {
  if (tokenExpiryInterval) {
    clearInterval(tokenExpiryInterval)
    tokenExpiryInterval = null
  }
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