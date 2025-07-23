// services/config/db.js

const mongoose = require('mongoose');
require('dotenv').config(); // Make sure this is at the top

const connectDB = async () => {
  try {
   mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
