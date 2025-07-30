const { fmpGet } = require('../../api-gateway/fmpApi');

const getStockDetails = async (req, res) => {
  const { symbol } = req.params;

  try {
    // 1. Get Quote
    const [quote] = await fmpGet(`quote/${symbol}`);
    if (!quote) return res.status(404).json({ error: 'Stock not found' });

    // 2. Get Profile
    const [profile] = await fmpGet(`profile/${symbol}`);

    // 3. Get Historical Data
    const history = await fmpGet(`historical-price-full/${symbol}`, { serietype: 'line' });

    return res.json({
      name: profile.companyName,
      logo: profile.image,
      price: quote.price,
      changesPercentage: quote.changesPercentage,
      description: profile.description,
      history: history.historical.slice(0, 30), // limit to last 30 days
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getStockDetails };
