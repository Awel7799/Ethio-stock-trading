const express = require('express');
const router = express.Router();
const { getStockDetails } = require('../Controllers/stockDetailController');

router.get('/details/:symbol', getStockDetails);

module.exports = router;
