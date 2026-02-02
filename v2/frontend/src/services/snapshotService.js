import api from './api';

export const fetchSnapshots = async () => {
  const res = await api.get('/snapshots');
  return res.data;
};
