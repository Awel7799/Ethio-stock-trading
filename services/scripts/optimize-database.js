const mongoose = require('mongoose');
require('dotenv').config();

const optimizeDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 Connected to database for optimization...');

    // Create indexes for better performance
    const User = require('../models/User');
    
    // Ensure indexes are created
    await User.createIndexes();
    console.log('✅ Database indexes created/verified');

    // Clean up expired refresh tokens
    const result = await User.updateMany(
      {},
      {
        $pull: {
          refreshTokens: {
            createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        }
      }
    );
    
    console.log(`🧹 Cleaned up expired tokens from ${result.modifiedCount} users`);

    // Get database statistics
    const stats = await mongoose.connection.db.stats();
    console.log('📈 Database Statistics:');
    console.log(`- Collections: ${stats.collections}`);
    console.log(`- Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);

    console.log('✅ Database optimization completed');
  } catch (error) {
    console.error('❌ Database optimization failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

optimizeDatabase();