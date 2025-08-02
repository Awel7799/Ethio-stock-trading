// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    
    // Removed deprecated options: useNewUrlParser and useUnifiedTopology
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    // Enhanced connection event handling
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('👋 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // More specific error messages
    if (error.message.includes('ECONNREFUSED')) {
      console.error('➡️  Check if MongoDB service is running');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('➡️  Check your MongoDB URI format and cluster name');
    } else if (error.message.includes('Authentication failed')) {
      console.error('➡️  Verify your database credentials');
    }
    
    console.error('➡️  Please check your MONGODB_URI environment variable');
    console.error('➡️  Ensure your IP is whitelisted in MongoDB Atlas');
    process.exit(1);
  }
};

module.exports = connectDB;