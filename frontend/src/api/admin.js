import axios from './axios';

export const adminAPI = {
  getAnalytics: async () => {
    const response = await axios.get('/admin/analytics');
    return response.data;
  },

  getUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`/admin/users?${params}`);
    return response.data;
  },

  getCollectionPoints: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`/admin/collection-points?${params}`);
    return response.data;
  },

  getPendingCollectionPoints: async () => {
    const response = await axios.get('/admin/collection-points/pending');
    return response.data;
  },

  approveCollectionPoint: async (id) => {
    const response = await axios.put(`/admin/collection-points/${id}/approve`);
    return response.data;
  },

  rejectCollectionPoint: async (id) => {
    const response = await axios.delete(`/admin/collection-points/${id}/reject`);
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await axios.put(`/admin/users/${id}/toggle-status`);
    return response.data;
  }
};