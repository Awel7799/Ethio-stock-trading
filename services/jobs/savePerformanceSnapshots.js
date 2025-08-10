// services/jobs/savePerformanceSnapshots.js

const { getAllUsers } = require('../services/userService');
const { calculatePortfolioValue, saveDailySnapshot } = require('../services/performanceService');

async function runDailySnapshotJob() {
  try {
    const users = await getAllUsers();

    if (!users?.length) {
      console.log('No users found to snapshot.');
      return;
    }

    for (const user of users) {
      try {
        // Calculate portfolio value for user
        let portfolioValue = await calculatePortfolioValue(user._id);

        // Defensive fallback to 0 if null/undefined/not a number
        if (typeof portfolioValue !== 'number' || isNaN(portfolioValue)) {
          portfolioValue = 0;
        }

        // Log user portfolio snapshot info
        if (portfolioValue === 0) {
          console.log(`No holdings found for user ${user._id}. Saving snapshot as $${portfolioValue.toFixed(2)}`);
        } else {
          console.log(`Saved snapshot for user ${user._id}: $${portfolioValue.toFixed(2)}`);
        }

        // Save snapshot to DB
        await saveDailySnapshot(user._id, portfolioValue);
      } catch (err) {
        console.error(`Error saving snapshot for user ${user._id}`, err);
      }
    }
  } catch (err) {
    console.error('Error running daily snapshot job:', err);
  }
}

module.exports = { runDailySnapshotJob };
