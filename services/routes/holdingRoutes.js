const express = require('express');
const router = express.Router();
const holdingController = require('../Controllers/holdingController');

// Routes
router.post('/', holdingController.createHolding);           // Create
router.get('/', holdingController.getAllHoldings);           // Read all
router.get('/:id', holdingController.getHoldingById);        // Read one
router.put('/:id', holdingController.updateHolding);         // Update
router.delete('/:id', holdingController.deleteHolding);      // Delete

module.exports = router;
