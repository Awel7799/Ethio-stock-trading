const express = require('express');
const router = express.Router();
const { getTopGainersLive } = require('../controllers/stockController');

// GET /api/stocks/gainers?limit=5
router.get('/gainers', getTopGainersLive);

module.exports = router;