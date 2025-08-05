// src/api/searchService.js

const BASE =  'http://localhost:3000';

export async function autocompleteStocks(query) {
  if (!query || !query.trim()) return [];
  const url = `${BASE}/api/search?q=${encodeURIComponent(query.trim())}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch autocomplete');
  }
  const { results } = await res.json();
  return results || [];
}

export async function fetchStockDetail(symbol) {
  if (!symbol) throw new Error('Symbol required');
  const url = `${BASE}/api/search/${encodeURIComponent(symbol)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch stock detail');
  }
  const { stock } = await res.json();
  return stock;
}