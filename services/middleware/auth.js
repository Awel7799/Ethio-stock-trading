// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate access token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
        code: 'TOKEN_REQUIRED'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by ID
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive',
          code: 'USER_NOT_FOUND'
        });
      }

      // Add user info to request
      req.user = {
        id: user._id,
        email: user.email,
        name: user.name
      };
      
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Access token has expired',
          code: 'TOKEN_EXPIRED'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid access token',
          code: 'INVALID_TOKEN'
        });
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
      code: 'AUTH_ERROR'
    });
  }
};

// Authenticate refresh token
const authenticateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required',
        code: 'REFRESH_TOKEN_REQUIRED'
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Find user and check if refresh token exists
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive',
          code: 'USER_NOT_FOUND'
        });
      }

      // Check if refresh token exists in user's tokens array
      const tokenExists = user.refreshTokens.some(tokenObj => tokenObj.token === refreshToken);
      if (!tokenExists) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN'
        });
      }

      // Add user and refresh token to request
      req.user = user;
      req.refreshToken = refreshToken;
      
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Refresh token has expired',
          code: 'REFRESH_TOKEN_EXPIRED'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN'
        });
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    console.error('Refresh token authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during refresh token authentication',
      code: 'REFRESH_AUTH_ERROR'
    });
  }
};

module.exports = {
  authenticate,
  authenticateRefreshToken
};