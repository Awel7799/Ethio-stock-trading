const axios = require('axios');

const FMP_BASE = 'https://financialmodelingprep.com/api/v3';

const fmpGet = async (endpoint, params = {}) => {
  const url = `${FMP_BASE}/${endpoint}`;
  const response = await axios.get(url, {
    params: { apikey: process.env.FMP_API_KEY, ...params },
  });
  return response.data;
};

module.exports = { fmpGet };