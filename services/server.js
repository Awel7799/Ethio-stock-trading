const express = require('express');
const connectDB = require('./config/db'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // 

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
