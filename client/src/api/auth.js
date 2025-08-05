const API_BASE_URL = 'http://localhost:3000/api';

// Token keys
const TOKEN_KEY = 'tradewise_access_token';
const REFRESH_TOKEN_KEY = 'tradewise_refresh_token';
const USER_KEY = 'tradewise_user';

// Token Getters
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

// Token Setters
export const setTokens = (accessToken, refreshToken, user) => {
  try {
    if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

export const clearTokens = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

// Unified request function
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

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      // Handle token expiration
      if (response.status === 401) {
        if (data.code === 'TOKEN_EXPIRED' || (data.message && data.message.includes('expired'))) {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            try {
              const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
              });

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                setTokens(refreshData.data.accessToken, refreshData.data.refreshToken, getUser());

                // Retry original request
                config.headers.Authorization = `Bearer ${refreshData.data.accessToken}`;
                const retryResponse = await fetch(`${API_BASE_URL}${url}`, config);
                return await retryResponse.json();
              }
            } catch (err) {
              console.error('Token refresh error:', err);
            }

            clearTokens();
            window.location.href = '/';
            return { success: false, message: 'Session expired' };
          } else {
            clearTokens();
            window.location.href = '/';
            return { success: false, message: 'No refresh token available' };
          }
        }

        return { success: false, message: 'Unauthorized' };
      }

      return { success: false, message: data.message || `HTTP ${response.status}` };
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    return { success: false, message: 'Network error. Please check your connection.' };
  }
};

// Auth API
export const authAPI = {
  signUp: async (userData) => {
    try {
      const response = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.success) {
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

  login: async (credentials) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success) {
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

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      return { success: true };
    }
  },

  getProfile: async () => {
    return await apiRequest('/auth/profile');
  },

  verifyToken: async () => {
    return await apiRequest('/auth/verify-token');
  },

  refreshToken: async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return { success: false, message: 'No refresh token available' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
  },
};

// Auto Token Expiry Check
export const startTokenExpiryChecker = () => {
  const checkTokenExpiry = () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const currentTime = Date.now() / 1000;

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

  checkTokenExpiry();
  setInterval(checkTokenExpiry, 60000); // every 1 min
};

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
