// src/api/buyService.js
export async function buyStock({ stockSymbol, quantity, purchasePrice, userId }) {
  const payload = {
    stockSymbol,
    quantity,
    purchasePrice,
    ...(userId ? { userId } : {}), // optional if you’re using fallback in backend
  };

  const res = await fetch('http://localhost:3000/api/buy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    // normalize error
    const message = data.error || 'Failed to buy stock';
    throw new Error(message);
  }

  return data; // includes holding and availableBalance
}