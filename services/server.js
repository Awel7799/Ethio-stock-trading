// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const settingRoutes = require('./routes/settingRoutes'); // Import settings routes
const stockRoutes = require('./routes/stockRoutes');     // ✅ Import stock routes
const cors = require('cors');
const stockDetailRoutes = require('./routes/detailStockDetailRouter');
const holdingRoutes = require('./routes/holdingRoutes');
const buyRouter = require('./routes/buyRouter'); 
const searchRouter = require('./routes/searchRouter');
dotenv.config();

const app = express();
app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use the routes
app.use('/api/stocks', stockRoutes);
app.use("/api/stocks", stockRoutes);
app.use('/api/stocks', stockDetailRoutes);
app.use('/api/holdings', holdingRoutes);
app.use('/api', buyRouter);
app.use('/api/search', searchRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
