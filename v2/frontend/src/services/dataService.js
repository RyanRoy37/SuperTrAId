import api from './api';

export const fetchStocks = () => api.get('/stocks');
export const fetchPortfolio = () => api.get('/portfolio');
export const fetchProfile = () => api.get('/profile');
export const fetchActivity = () => api.get('/activity');
