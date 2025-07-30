const express = require('express');
const router = express.Router();
const { getTopMovers } = require('../controllers/stockController');

router.get('/:symbol', getTopMovers); // temporary usage, not by symbol
module.exports = router;
