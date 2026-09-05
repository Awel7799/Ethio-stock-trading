import { API_BASE_URL } from "../config/api";
import { getAccessToken } from "../api/auth";

export async function sellStock({ stockSymbol, quantity, sellPrice, purchaseDate }) {
  const payload = {
    stockSymbol,
    quantity,
    sellPrice,
    purchaseDate: purchaseDate || new Date().toISOString(),
  };

  const res = await fetch(`${API_BASE_URL}/sell`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const message = data.error || 'Failed to sell stock';
    throw new Error(message);
  }

  return data; // backend can return updated holding, balance, profitLoss, etc.
}