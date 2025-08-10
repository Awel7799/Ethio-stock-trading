const Holding = require('../models/Holding');

exports.createHolding = async (req, res) => {
  try {
    const userId = req.body.userId; // userId from frontend (AuthContext)
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const holding = new Holding({ ...req.body, userId });
    const saved = await holding.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getAllHoldings = async (req, res) => {
  try {
    const userId = req.query.userId;  // <=== change here from req.body to req.query

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const holdings = await Holding.find({ userId });
    res.json(holdings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHoldingById = async (req, res) => {
  try {
    const userId = req.body.userId; // or from query/header
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const holding = await Holding.findOne({ _id: req.params.id, userId });
    if (!holding) return res.status(404).json({ error: 'Holding not found' });
    res.json(holding);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
