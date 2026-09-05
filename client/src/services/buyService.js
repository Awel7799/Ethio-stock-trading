import { API_BASE_URL } from "../config/api";

export async function buyStock({ stockSymbol, quantity, purchasePrice, userId }) {
  const payload = {
    stockSymbol,
    quantity,
    purchasePrice,
    ...(userId ? { userId } : {}), // optional if using fallback in backend
  };

  const res = await fetch(`${API_BASE_URL}/buy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const message = data.error || 'Failed to buy stock';
    throw new Error(message);
  }

  return data; // { holding, availableBalance }
}