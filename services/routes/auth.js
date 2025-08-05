const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authControler');
const authMiddleware = require('../middleware/auth');

console.log('📁 Auth routes loaded');

// Auth Routes
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authMiddleware.authenticate, authController.logout);
router.get('/profile', authMiddleware.authenticate, authController.getProfile);
router.get('/verify-token', authMiddleware.authenticate, authController.verifyToken);

module.exports = router;
