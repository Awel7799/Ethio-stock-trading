const express = require('express');
const { buyStock } = require('../Controllers/buyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/buy', authMiddleware, buyStock);

module.exports = router;