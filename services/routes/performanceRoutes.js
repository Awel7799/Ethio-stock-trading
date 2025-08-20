const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PerformanceSnapshot = require('../models/PerformanceSnapshot'); // Adjust path as needed

router.get('/api/performance/:userId/history', async (req, res) => {
  const { userId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  try {
    // Cast userId to ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId);

    const history = await PerformanceSnapshot.find({ userId: userObjectId }).sort({ date: 1 });

    return res.json(history);
  } catch (error) {
    console.error('Error fetching performance history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
