const express = require('express');
const {
  autocompleteStocks,
  getStockDetail,
} = require('../controllers/searchController');

const router = express.Router();

router.get('/', autocompleteStocks);          // /api/search?q=...
router.get('/:symbol', getStockDetail);      // /api/search/AAPL

module.exports = router;