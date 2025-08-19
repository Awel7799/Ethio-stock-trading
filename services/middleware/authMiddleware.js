// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Main authentication middleware (default export for wallet routes)
const authMiddleware = async (req, res, next) => {
  try {
    console.log('🔐 AUTH MIDDLEWARE: Request headers:', req.headers);
    
    // Get token from header (using req.header method like original)
    const authHeader = req.header('Authorization');
    console.log('🔍 AUTH MIDDLEWARE: Auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ AUTH MIDDLEWARE: No valid auth header found');
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
        code: 'TOKEN_REQUIRED'
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('🎫 AUTH MIDDLEWARE: Token extracted:', token ? 'Token present' : 'No token');

    if (!token) {
      console.log('❌ AUTH MIDDLEWARE: No token found after extraction');
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
        code: 'TOKEN_REQUIRED'
      });
    }

    // Verify token - FIXED: Use JWT_SECRET (not JWT_ACCESS_SECRET)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ AUTH MIDDLEWARE: Token decoded successfully:', decoded);
    } catch (jwtError) {
      console.log('❌ AUTH MIDDLEWARE: Token verification failed:', jwtError.message);
      
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

    // Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      console.log('❌ AUTH MIDDLEWARE: User not found or inactive:', decoded.userId);
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive',
        code: 'USER_NOT_FOUND'
      });
    }

    console.log('✅ AUTH MIDDLEWARE: User authenticated successfully:', user._id);

    // FIXED: Attach user info to request (matching your controller expectations)
    req.user = {
      userId: user._id.toString(), // Your controller expects userId, not id
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    console.error('❌ AUTH MIDDLEWARE: Unexpected error:', error);
    return res.status(500).json({
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

// Export the main middleware as default, and named exports for others
module.exports = authMiddleware;
module.exports.authenticate = authMiddleware; // Alias for compatibility
module.exports.authenticateRefreshToken = authenticateRefreshToken;