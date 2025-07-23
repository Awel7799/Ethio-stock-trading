const mongoose = require('mongoose');
require('dotenv').config();

async function optimizeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    console.log('🔍 Analyzing database performance...');

    // Get collection stats
    const collections = ['users', 'wallets', 'wallet_transactions', 'trade_orders', 'stocks'];
    
    for (const collectionName of collections) {
      const stats = await db.collection(collectionName).stats();
      console.log(`📊 ${collectionName}:`, {
        documents: stats.count,
        avgObjSize: Math.round(stats.avgObjSize || 0),
        totalIndexSize: Math.round((stats.totalIndexSize || 0) / 1024) + ' KB'
      });
    }

    // Check for missing indexes
    console.log('\n🔍 Checking for slow operations...');
    const slowOps = await db.admin().command({
      currentOp: true,
      "active": true,
      "secs_running": { "$gt": 1 }
    });

    if (slowOps.inprog.length > 0) {
      console.log('⚠️  Found slow operations:', slowOps.inprog.length);
    } else {
      console.log('✅ No slow operations found');
    }

    await mongoose.connection.close();
    console.log('📊 Database optimization check complete');

  } catch (error) {
    console.error('❌ Optimization check failed:', error.message);
  }
}

optimizeDatabase();