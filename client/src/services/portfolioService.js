export async function fetchStockPortfolio(userId, symbol, currentPrice) {
  const res = await fetch(
    `http://localhost:3000/api/portfolio/${userId}/${symbol}?currentPrice=${currentPrice}`
  );
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to fetch portfolio details');
  }
  return res.json();
}
