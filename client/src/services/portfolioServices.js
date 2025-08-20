const API_BASE = "http://localhost:3000";

export async function fetchUserPortfolio(userId, currentPrices = {}) {
  if (!userId) throw new Error("Invalid userId");

  let url = `${API_BASE}/api/portfolio/${userId}`;
  if (Object.keys(currentPrices).length > 0) {
    const pricesQuery = encodeURIComponent(JSON.stringify(currentPrices));
    url += `?currentPrices=${pricesQuery}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    let errorText = 'Failed to fetch portfolio';
    try {
      const data = await res.json();
      if (data.error) errorText = data.error;
    } catch {}
    throw new Error(errorText);
  }
  return res.json();
}
