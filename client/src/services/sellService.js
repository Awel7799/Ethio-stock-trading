// services/sellService.js
import axios from 'axios';

export async function sellStock({ userId, stockSymbol, quantity, sellPrice, purchaseDate }) {
  try {
    const response = await axios.post('/api/sell', {
      userId,
      stockSymbol,
      quantity,
      sellPrice,
      purchaseDate: purchaseDate || new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || error.message || 'Sell request failed'
    );
  }
}
