import { API_BASE_URL } from "../config/api";

export async function fetchStockPortfolio(userId, symbol, currentPrice) {
  const res = await fetch(
    `${API_BASE_URL}/portfolio/${userId}/${symbol}?currentPrice=${currentPrice}`
  );

  const data = await res.json(); // ✅ read response once

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch portfolio details');
  }

  return data;
}
