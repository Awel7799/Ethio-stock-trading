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
        if (isAuthenticated()) {
          const userData = getUser();
          setUser(userData);
          setIsLoggedIn(true);
          startTokenExpiryChecker();
          
          // Verify token with backend
          const response = await authAPI.verifyToken();
          if (!response.success) {
            // Token is invalid, clear everything
            clearTokens();
            setUser(null);
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearTokens();
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        startTokenExpiryChecker();
        return response;
      } else {
        return response;
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.signUp(userData);
      
      if (response.success) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        startTokenExpiryChecker();
        return response;
      } else {
        return response;
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, message: 'Sign up failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setUser(null);
      setIsLoggedIn(false);
      setLoading(false);
      window.location.href = '/';
    }
  };

  const updateUser = (userData) => {
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