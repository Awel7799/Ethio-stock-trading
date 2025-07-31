// routes/auth.js - SUPER SIMPLE VERSION (NO VALIDATION)
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const authMiddleware = require('../middleware/auth');

console.log('📁 Auth routes loaded');

// Auth Routes - NO VALIDATION MIDDLEWARE
router.post('/signup', (req, res, next) => {
  console.log('🚀 POST /auth/signup route hit');
  authController.signUp(req, res, next);
});

router.post('/login', (req, res, next) => {
  console.log('🚀 POST /auth/login route hit');
  authController.login(req, res, next);
});

router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);
router.get('/profile', authMiddleware, authController.getProfile);
router.get('/verify-token', authMiddleware, authController.verifyToken);

module.exports = router;