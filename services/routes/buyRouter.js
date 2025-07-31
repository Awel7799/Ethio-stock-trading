const express = require('express');
const { buyStock } = require('../Controllers/buyController');

const router = express.Router();

/**
 * POST /buy
 * Body example:
 * {
 *   "userId": "64f1a2b3c4d5e6f7a8b9c0d1",    // optional, fallback is used if missing
 *   "stockSymbol": "AAPL",
 *   "quantity": 10,
 *   "purchasePrice": 150.5,
 *   "purchaseDate": "2025-07-31T12:00:00Z" // optional
 * }
 */
router.post('/buy', buyStock);

module.exports = router;
