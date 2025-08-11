const express = require('express');
const { getPortfolio } = require('../Controllers/portfolioController');

const router = express.Router();

router.get('/portfolio/:userId', getPortfolio);

module.exports = router;
