// routes/sellRouter.js
const express = require('express');
const { sellStock } = require('../Controllers/sellController');

const router = express.Router();

// POST request for selling stock
router.post('/sell', sellStock);

module.exports = router;
