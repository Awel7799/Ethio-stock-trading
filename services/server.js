const express = require('express');
const connectDB = require('./config/db'); // ✅ CORRECT path
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // ✅ This should now work!

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
