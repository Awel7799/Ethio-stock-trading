import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getUser, isAuthenticated, clearTokens, startTokenExpiryChecker, stopTokenExpiryChecker } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Helper function to clear all auth state
  const clearAuthState = () => {
    console.log('🧹 Clearing auth state...');
    clearTokens();
    setUser(null);
    setIsLoggedIn(false);
    stopTokenExpiryChecker();
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        if (isAuthenticated()) {
          console.log('✅ User appears authenticated, getting user data...');
          const userData = getUser();
          
          if (userData) {
            setUser(userData);
            setIsLoggedIn(true);
            startTokenExpiryChecker();
            
            console.log('🔍 Verifying token with backend...');
            
            try {
              // Verify token with backend
              const response = await authAPI.verifyToken();
              console.log('📡 Token verification response:', response);
              
              if (response.success) {
                // Update user data with fresh data from backend
                setUser(response.data.user || response.user || userData);
                setIsLoggedIn(true);
                console.log('✅ Token verified successfully');
              } else {
                console.log('❌ Token verification failed, clearing auth state');
                clearAuthState();
              }
            } catch (verifyError) {
              console.error('❌ Token verification error:', verifyError);
              // If verification fails (network error, etc.), clear auth state
              clearAuthState();
            }
          } else {
            console.log('❌ No user data found, clearing tokens');
            clearAuthState();
          }
        } else {
          console.log('❌ User not authenticated');
          clearAuthState();
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        clearAuthState();
      } finally {
        setLoading(false);
        console.log('✅ Auth initialization complete');
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login...');
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        console.log('✅ Login successful');
        const userData = response.data?.user || response.user;
        setUser(userData);
        setIsLoggedIn(true);
        startTokenExpiryChecker();
        return response;
      } else {
        console.log('❌ Login failed:', response.message);
        clearAuthState();
        return response;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      clearAuthState();
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      console.log('📝 Attempting sign up...');
      setLoading(true);
      const response = await authAPI.signUp(userData);
      
      if (response.success) {
        console.log('✅ Sign up successful');
        const user = response.data?.user || response.user;
        setUser(user);
        setIsLoggedIn(true);
        startTokenExpiryChecker();
        return response;
      } else {
        console.log('❌ Sign up failed:', response.message);
        clearAuthState();
        return response;
      }
    } catch (error) {
      console.error('❌ Sign up error:', error);
      clearAuthState();
      return { success: false, message: 'Sign up failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Starting logout process...');
      console.log('Before logout - isLoggedIn:', isLoggedIn);
      console.log('Before logout - user:', user);
      
      setLoading(true);
      
      // Clear auth state immediately to prevent UI delays
      clearAuthState();
      
      // Then call the API logout (even if this fails, we've already cleared local state)
      try {
        await authAPI.logout();
        console.log('✅ API logout successful');
      } catch (apiError) {
        console.warn('⚠️ API logout failed, but local state cleared:', apiError);
      }
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Ensure state is cleared even if there's an error
      clearAuthState();
    } finally {
      setLoading(false);
      console.log('✅ Logout complete');
      console.log('After logout - isLoggedIn:', false);
      
      // Force redirect to home page
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  };

  const updateUser = (userData) => {
    console.log('👤 Updating user data:', userData);
    if (userData) {
      setUser(userData);
      // Ensure we're still marked as logged in
      if (!isLoggedIn) {
        setIsLoggedIn(true);
      }
    } else {
      clearAuthState();
    }
  };

  // Listen for storage changes (logout from another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'tradewise_access_token' && !e.newValue && isLoggedIn) {
        console.log('🔄 Token cleared in another tab, logging out...');
        clearAuthState();
        setLoading(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isLoggedIn]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTokenExpiryChecker();
    };
  }, []);

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    signUp,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};