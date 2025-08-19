// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authControler'); // Match your actual file name and path
const authMiddleware = require('../middleware/authMiddleware');

console.log('📁 Auth routes loaded');

// Auth Routes
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authMiddleware.authenticate, authController.logout);
router.get('/profile', authMiddleware.authenticate, authController.getProfile);
router.get('/verify-token', authMiddleware.authenticate, authController.verifyToken);

// Add a test route to debug
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Auth routes are working' });
});

console.log('📋 Auth routes registered:', [
  'POST /signup',
  'POST /login', 
  'POST /refresh-token',
  'POST /logout',
  'GET /profile',
  'GET /verify-token',
  'GET /test'
]);

module.exports = router;