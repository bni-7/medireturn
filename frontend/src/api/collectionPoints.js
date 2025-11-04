import api from './axios';

export const collectionPointsAPI = {
  register: async (data) => {
    const response = await api.post('/collection-points', data);
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get('/collection-points', { params });
    // ✅ Remove console.log
    return response.data.collectionPoints || response.data.data || response.data || [];
  },

  getById: async (id) => {
    const response = await api.get(`/collection-points/${id}`);
    return response.data.data || response.data;
  },

  getMine: async () => {
    const response = await api.get('/collection-points/my/point');
    return response.data.data || response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/collection-points/my/dashboard');
    return response.data.data || response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/collection-points/${id}`, data);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/collection-points/${id}`);
    return response.data;
  }
};