import api from './api';

export const fetchStock = async (id) => {
  const res = await api.get(`/stocks/${id}`);
  return res.data;
};

export const fetchStockHistory = async (id) => {
  const res = await api.get(`/stocks/${id}/history`);
  return res.data;
};
