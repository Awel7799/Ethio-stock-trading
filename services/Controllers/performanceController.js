// controllers/performanceController.js - NEW FILE (Create this file)
const Investment = require('../models/Investment'); // Adjust path to your Investment model

const getUserPerformanceHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`Fetching performance history for user: ${userId}`);

    // Get user's investment history sorted by date
    const investments = await Investment.find({ userId })
      .sort({ transactionDate: 1 })
      .lean(); // Use lean() for better performance

    if (!investments || investments.length === 0) {
      console.log(`No investments found for user: ${userId}`);
      return res.json([]);
    }

    console.log(`Found ${investments.length} investments for user: ${userId}`);

    // Calculate portfolio value over time
    const performanceMap = new Map();
    let runningTotal = 0;
    
    // Group investments by date
    investments.forEach(investment => {
      const date = investment.transactionDate.toISOString().split('T')[0];
      const value = investment.type === 'buy' 
        ? investment.quantity * investment.price   // Positive for portfolio value
        : -(investment.quantity * investment.price); // Negative for sells
      
      if (!performanceMap.has(date)) {
        performanceMap.set(date, 0);
      }
      performanceMap.set(date, performanceMap.get(date) + value);
    });

    // Convert to cumulative portfolio values
    const performanceHistory = [];
    for (const [date, dayValue] of performanceMap.entries()) {
      runningTotal += dayValue;
      performanceHistory.push({
        date: date,
        portfolioValue: Math.max(runningTotal, 0), // Ensure non-negative
        totalInvested: runningTotal,
        dailyChange: dayValue
      });
    }

    // Sort by date
    performanceHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log(`Returning ${performanceHistory.length} performance data points`);
    res.json(performanceHistory);

  } catch (error) {
    console.error('Error fetching performance history:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch performance history',
      message: error.message 
    });
  }
};

const updateUserPerformance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { portfolioValue, date } = req.body;

    // This is optional - you can implement if needed
    // For now, we'll calculate performance based on investments

    res.json({ 
      message: 'Performance updated successfully',
      userId,
      portfolioValue,
      date 
    });

  } catch (error) {
    console.error('Error updating performance:', error.message);
    res.status(500).json({ 
      error: 'Failed to update performance',
      message: error.message 
    });
  }
};

module.exports = { 
  getUserPerformanceHistory,
  updateUserPerformance 
};