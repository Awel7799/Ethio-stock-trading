import axios from 'axios';

export const fetchStockDetails = async (symbol) => {
  const response = await axios.get(`http://localhost:3000/api/stocks/details/${symbol}`);
  return response.data;
};