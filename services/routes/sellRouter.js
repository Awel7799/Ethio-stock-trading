// routes/sellRouter.js
const express = require('express');
const { sellStock } = require('../Controllers/sellController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST request for selling stock
router.post('/sell', authMiddleware, sellStock);

module.exports = router;
