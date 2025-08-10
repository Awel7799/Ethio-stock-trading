const BASE = 'http://localhost:3000/api/holdings';

async function request(path = '', options = {}) {
  const url = `${BASE}${path}`;
  let res;
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
  } catch (networkErr) {
    console.error('Network error fetching', url, networkErr);
    throw new Error('Network error: ' + networkErr.message);
  }

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const err = new Error(data?.error || res.statusText || 'API error');
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data;
}

export const createHolding = (holding) =>
  request('/', { method: 'POST', body: JSON.stringify(holding) });

export const getHoldings = (userId) => request(`/?userId=${userId}`);

export const getHolding = (id) => request(`/${id}`);

export const updateHolding = (id, updates) =>
  request(`/${id}`, { method: 'PUT', body: JSON.stringify(updates) });

export const deleteHolding = (id) =>
  request(`/${id}`, { method: 'DELETE' });
