// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const { getStockDetails } = require('../controllers/stockDetailController');
const { getTopGainersLive } = require('../controllers/stockController');

// Existing route for stock details
router.get('/details/:symbol', getStockDetails);

// NEW ROUTE - This was missing and causing 404 for gainers
router.get('/gainers', getTopGainersLive);

// If you have other stock-related routes, add them here
// router.get('/search/:query', searchStocks);
// router.get('/quote/:symbol', getStockQuote);

module.exports = router;