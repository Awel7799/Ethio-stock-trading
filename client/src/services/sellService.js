// src/services/sellService.js
export async function sellStock({ stockSymbol, quantity, sellPrice, userId, purchaseDate }) {
  const payload = {
    stockSymbol,
    quantity,
    sellPrice,
    purchaseDate: purchaseDate || new Date().toISOString(),
    ...(userId ? { userId } : {}), // optional if backend can get from auth
  };

  const res = await fetch('http://localhost:3000/api/sell', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
