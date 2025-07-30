// routes/settingRoutes.js
const express = require('express');
const router = express.Router();
const settingController = require('../Controllers/settingController');

// Route to create a new user
router.post('/user', settingController.createUser);

module.exports = router;
