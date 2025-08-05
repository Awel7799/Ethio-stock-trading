// routes/investmentRoutes.js
const express = require('express');
const router = express.Router();
const {
  getIndividualInvestment,
  getTotalInvestment,
} = require('../Controllers/totalInvestmentController');

// GET individual holding: userId & symbol
// e.g., /api/investments/user/64f1e2.../AAPL
router.get('/user/:userId/:symbol', getIndividualInvestment);

// GET total holdings for a user
// e.g., /api/investments/user/64f1e2...
router.get('/user/:userId', getTotalInvestment);

module.exports = router;