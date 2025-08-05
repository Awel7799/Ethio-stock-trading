// test-mongo.js - Run this to test MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set in environment variables');
      return;
    }
    
    // Try to connect
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('👋 Connection closed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    // Specific error messages
    if (error.message.includes('ENOTFOUND')) {
      console.error('🔍 Cluster not found - check your cluster name in MongoDB Atlas');
    } else if (error.message.includes('Authentication failed')) {
      console.error('🔐 Authentication failed - check username/password');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('🌐 Connection refused - check network access in MongoDB Atlas');
    }
    
    process.exit(1);
  }
};

testConnection();