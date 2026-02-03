import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
};

export const stockAPI = {
  getStocks: (params) => api.get('/stocks', { params }),
  getStockDetails: (id) => api.get(`/stocks/${id}`),
};

export const portfolioAPI = {
  getPortfolio: (params) => api.get('/portfolio', { params }),
};

export const transactionAPI = {
  buyStock: (data) => api.post('/transactions/buy', data),
  sellStock: (data) => api.post('/transactions/sell', data),
  getTransactions: (params) => api.get('/transactions', { params }),
};

export const bundleAPI = {
  createBundle: (data) => api.post('/bundles', data),
  getBundles: (params) => api.get('/bundles', { params }),
  buyBundle: (id) => api.post(`/bundles/${id}/buy`),
};

export const wishlistAPI = {
  addToWishlist: (data) => api.post('/wishlist', data),
  getWishlist: (params) => api.get('/wishlist', { params }),
  removeFromWishlist: (stockId) => api.delete(`/wishlist/${stockId}`),
};

export const goalAPI = {
  createGoal: (data) => api.post('/goals', data),
  getGoals: () => api.get('/goals'),
  updateGoal: (id, data) => api.put(`/goals/${id}`, data),
};

export default api;