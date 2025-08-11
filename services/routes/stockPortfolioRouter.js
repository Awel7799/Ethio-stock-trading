// routes/stockPortfolioRouter.js
const express = require('express');
const { getStockPortfolioDetails } = require('../Controllers/stockPortfolioController');

const router = express.Router();

// GET /api/portfolio/:userId/:stockSymbol?currentPrice=123
router.get('/portfolio/:userId/:stockSymbol', getStockPortfolioDetails);

module.exports = router;
