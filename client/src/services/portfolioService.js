export async function fetchStockPortfolio(userId, symbol, currentPrice) {
  const res = await fetch(
    `http://localhost:3000/api/portfolio/${userId}/${symbol}?currentPrice=${currentPrice}`
  );

  const data = await res.json(); // ✅ read response once

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch portfolio details');
  }

  return data;
}
