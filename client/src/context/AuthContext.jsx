import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getUser, isAuthenticated, clearTokens, startTokenExpiryChecker } from '../api/auth';

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
                setUser(response.data.user);
                console.log('✅ Token verified successfully');
              } else {
                console.log('❌ Token verification failed, clearing auth state');
                // Token is invalid, clear everything
                clearTokens();
                setUser(null);
                setIsLoggedIn(false);
              }
            } catch (verifyError) {
              console.error('❌ Token verification error:', verifyError);
              // If verification fails (network error, etc.), clear auth state
              clearTokens();
              setUser(null);
              setIsLoggedIn(false);
            }
          } else {
            console.log('❌ No user data found, clearing tokens');
            clearTokens();
            setUser(null);
            setIsLoggedIn(false);
          }
        } else {
          console.log('❌ User not authenticated');
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        clearTokens();
        setUser(null);
        setIsLoggedIn(false);
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
        setUser(response.data.user);
        setIsLoggedIn(true);
        startTokenExpiryChecker();
        return response;
      } else {
        console.log('❌ Login failed:', response.message);
        return response;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
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
        setUser(response.data.user);
        setIsLoggedIn(true);
        startTokenExpiryChecker();
        return response;
      } else {
        console.log('❌ Sign up failed:', response.message);
        return response;
      }
    } catch (error) {
      console.error('❌ Sign up error:', error);
      return { success: false, message: 'Sign up failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Attempting logout...');
      setLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      console.log('✅ Logout complete, clearing auth state');
      clearTokens();
      setUser(null);
      setIsLoggedIn(false);
      setLoading(false);
      // Only redirect to home if we're not already there
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
  };

  const updateUser = (userData) => {
    console.log('👤 Updating user data:', userData);
    setUser(userData);
  };

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