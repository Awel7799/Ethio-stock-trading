// services/stockAPI.js
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const fetchStockDetails = async (symbol) => {
  const response = await axios.get(`${API_BASE_URL}/stocks/details/${symbol}`);
  return response.data;
};