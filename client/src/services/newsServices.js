const API_BASE = "http://localhost:3000"; // adjust for production

export async function fetchMarketNews() {
  const res = await fetch(`${API_BASE}/api/news`);
  if (!res.ok) {
    throw new Error("Failed to fetch market news");
  }
  return res.json();
}
