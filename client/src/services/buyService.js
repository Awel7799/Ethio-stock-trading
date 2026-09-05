import { API_BASE_URL } from "../config/api";

import { getAccessToken } from "../api/auth";

export async function buyStock({ stockSymbol, quantity, purchasePrice }) {
  const payload = {
    stockSymbol,
    quantity,
    purchasePrice,
  };

  const res = await fetch(`${API_BASE_URL}/buy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
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