// API Configuration - Browser compatible
// src/api/auth.js
const API_BASE_URL = 'http://localhost:5000/api';

// Token management
const TOKEN_KEY = 'tradewise_access_token';
const REFRESH_TOKEN_KEY = 'tradewise_refresh_token';
const USER_KEY = 'tradewise_user';

// Get stored tokens
export const getAccessToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

export const getRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const getUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Store tokens
export const setTokens = (accessToken, refreshToken, user) => {
  try {
    if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

// Clear tokens
export const clearTokens = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

// API request helper with automatic token refresh
const apiRequest = async (url, options = {}) => {
  const accessToken = getAccessToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    // Check if response is ok
    if (!response.ok) {
      // Handle different HTTP status codes
      if (response.status === 401) {
        const data = await response.json().catch(() => ({}));
        
        // Handle token expiration
        if (data.code === 'TOKEN_EXPIRED' || data.message?.includes('expired')) {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            try {
              const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
              });

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                setTokens(refreshData.data.accessToken, refreshData.data.refreshToken, getUser());
                
                // Retry original request with new token
                config.headers.Authorization = `Bearer ${refreshData.data.accessToken}`;
                const retryResponse = await fetch(`${API_BASE_URL}${url}`, config);
                return await retryResponse.json();
              } else {
                // Refresh failed, redirect to login
                clearTokens();
                window.location.href = '/';
                return { success: false, message: 'Session expired' };
              }
            } catch (refreshError) {
              console.error('Token refresh error:', refreshError);
              clearTokens();
              window.location.href = '/';
              return { success: false, message: 'Session expired' };
            }
          } else {
            clearTokens();
            window.location.href = '/';
            return { success: false, message: 'No refresh token available' };
          }
        }
        
        return { success: false, message: 'Unauthorized' };
      }
      
      // Handle other HTTP errors
      const errorData = await response.json().catch(() => ({}));
      return { success: false, message: errorData.message || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return { success: false, message: 'Network error. Please check your connection.' };
  }
};

// Authentication API functions
export const authAPI = {
  // Sign Up
  signUp: async (userData) => {
    try {
      const response = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (response.success) {
        // Handle both possible response formats
        const accessToken = response.token || response.data?.accessToken;
        const refreshToken = response.data?.refreshToken;
        const user = response.user || response.data?.user;
        
        setTokens(accessToken, refreshToken, user);
      }
      
      return response;
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, message: 'Sign up failed' };
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.success) {
        // Handle both possible response formats
        const accessToken = response.token || response.data?.accessToken;
        const refreshToken = response.data?.refreshToken;
        const user = response.user || response.data?.user;
        
        setTokens(accessToken, refreshToken, user);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await apiRequest('/auth/logout', {
        method: 'POST',
      });
      
      clearTokens();
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      clearTokens();
      return { success: false, message: 'Logout failed' };
    }
  },

  // Get Profile
  getProfile: async () => {
    return await apiRequest('/auth/profile');
  },

  // Verify Token
  verifyToken: async () => {
    return await apiRequest('/auth/verify-token');
  },

  // Refresh Token (if needed)
  refreshToken: async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return { success: false, message: 'No refresh token available' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setTokens(data.data.accessToken, data.data.refreshToken, getUser());
        return data;
      } else {
        clearTokens();
        return { success: false, message: data.message || 'Token refresh failed' };
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      clearTokens();
      return { success: false, message: 'Token refresh failed' };
    }
  }
};

// Token expiry checker - runs every minute
export const startTokenExpiryChecker = () => {
  const checkTokenExpiry = () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        // If token expires in less than 5 minutes, try to refresh
        if (payload.exp - currentTime < 300) {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            authAPI.refreshToken();
          } else {
            clearTokens();
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('Token parsing error:', error);
        clearTokens();
        window.location.href = '/';
      }
    }
  };

  // Check immediately and then every minute
  checkTokenExpiry();
  setInterval(checkTokenExpiry, 60000);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAccessToken();
  const user = getUser();
  
  if (!token || !user) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};