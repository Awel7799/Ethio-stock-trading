const express = require('express');
const { buyStock } = require('../Controllers/buyController');

const router = express.Router();


router.post('/buy', buyStock);

module.exports = router;