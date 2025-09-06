// services/finnhubClient.js
const axios = require('axios');
const API_KEY = process.env.token;
const BASE = 'https://finnhub.io/api/v1';

async function finnhubGet(endpoint, params = {}) {
  const url = `${BASE}/${endpoint}`;
  const response = await axios.get(url, { params: { token: API_KEY, ...params } });
  return response.data;
}

module.exports = { finnhubGet };
