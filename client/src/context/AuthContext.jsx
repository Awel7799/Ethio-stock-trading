//context/AuthContext.jsx
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
      console.log('🚀 AuthContext: Initializing authentication...');
      
      try {
        // Check if user has valid tokens
        if (isAuthenticated()) {
          console.log('✅ AuthContext: Tokens found, getting user data...');
          
          const userData = getUser();
          if (userData) {
            setUser(userData);
            setIsLoggedIn(true);
            startTokenExpiryChecker();
            
            console.log('🔍 AuthContext: Verifying token with backend...');
            
            // Verify token with backend
            try {
              const response = await authAPI.verifyToken();
              if (response.success) {
                console.log('✅ AuthContext: Token verified successfully');
                // Update user data if backend returned newer data
                if (response.data?.user) {
                  setUser(response.data.user);
                }
              } else {
                console.log('❌ AuthContext: Token verification failed, clearing tokens');
                clearTokens();
                setUser(null);
                setIsLoggedIn(false);
              }
            } catch (verifyError) {
              console.log('❌ AuthContext: Token verification error, clearing tokens');
              clearTokens();
              setUser(null);
              setIsLoggedIn(false);
            }
          } else {
            console.log('❌ AuthContext: No user data found, clearing tokens');
            clearTokens();
            setUser(null);
            setIsLoggedIn(false);
          }
        } else {
          console.log('🌐 AuthContext: No valid tokens found, user not logged in');
          // Make sure everything is clean
          clearTokens();
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('❌ AuthContext: Auth initialization error:', error);
        clearTokens();
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        console.log('🏁 AuthContext: Auth initialization complete');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔐 AuthContext: Starting login...');
      setLoading(true);
      
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        console.log('✅ AuthContext: Login successful');
        setUser(response.data?.user || response.user);
        setIsLoggedIn(true);
        startTokenExpiryChecker();
        return response;
      } else {
        console.log('❌ AuthContext: Login failed:', response.message);
        return response;
      }
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      console.log('📝 AuthContext: Starting signup...');
      setLoading(true);
      
      const response = await authAPI.signUp(userData);
      
      if (response.success) {
        console.log('✅ AuthContext: Signup successful');
        setUser(response.data?.user || response.user);
        setIsLoggedIn(true);
        startTokenExpiryChecker();
        return response;
      } else {
        console.log('❌ AuthContext: Signup failed:', response.message);
        return response;
      }
    } catch (error) {
      console.error('❌ AuthContext: Signup error:', error);
      return { success: false, message: 'Sign up failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('👋 AuthContext: Starting logout...');
      setLoading(true);
      
      // Try to call logout API, but don't fail if it doesn't work
      try {
        await authAPI.logout();
      } catch (logoutError) {
        console.log('⚠️ AuthContext: Logout API call failed, but continuing...');
      }
      
    } catch (error) {
      console.error('❌ AuthContext: Logout error:', error);
    } finally {
      // Always clear local state regardless of API call success
      clearTokens();
      setUser(null);
      setIsLoggedIn(false);
      setLoading(false);
      
      console.log('✅ AuthContext: Logout complete, redirecting...');
      window.location.href = '/';
    }
  };

  const updateUser = (userData) => {
    console.log('📝 AuthContext: Updating user data');
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

  console.log('🔄 AuthContext: Current state:', { 
    isLoggedIn, 
    loading, 
    hasUser: !!user 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};