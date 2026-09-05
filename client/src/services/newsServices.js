import { API_BASE_URL } from "../config/api";

export async function fetchMarketNews() {
  const res = await fetch(`${API_BASE_URL}/news`);
  if (!res.ok) {
    throw new Error("Failed to fetch market news");
  }
  return res.json();
}
