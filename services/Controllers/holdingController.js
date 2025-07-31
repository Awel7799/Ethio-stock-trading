// this is the holdingController.js file and have the following tasks 
// 1 extract the amount and type of the stock from the coming API 
// 2 write the function called getbalance which will check the avialable balance of the user from wallet
// 3 write the fuction that check if the balance is enuegh for buying the stock 
// 4 if balance is sufficient store on  the holding table and if not return error message 

// the logical flow of the selling stock 
// 1 the data extracted from coming API body the type of stock amount to be sold 
// 2 check the database for stock avialability 
// 3 if the stock is avialable fetch the current price of the stock and multiply it with amount and delete the holding from the db table and update wallet table 

const Holding = require('../models/Holding');

// Create new holding
exports.createHolding = async (req, res) => {
  try {
    const holding = new Holding(req.body);
    const saved = await holding.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all holdings
exports.getAllHoldings = async (req, res) => {
  try {
    const holdings = await Holding.find();
    res.json(holdings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get holding by ID
exports.getHoldingById = async (req, res) => {
  try {
    const holding = await Holding.findById(req.params.id);
    if (!holding) return res.status(404).json({ error: 'Holding not found' });
    res.json(holding);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update holding
exports.updateHolding = async (req, res) => {
  try {
    const updated = await Holding.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Holding not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete holding
exports.deleteHolding = async (req, res) => {
  try {
    const deleted = await Holding.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Holding not found' });
    res.json({ message: 'Holding deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
