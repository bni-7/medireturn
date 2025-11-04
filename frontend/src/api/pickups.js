import axios from './axios';

export const pickupsAPI = {
  schedule: async (data) => {
    console.log('📡 pickupsAPI.schedule called with:', data); // ✅ Debug log
    try {
      const response = await axios.post('/pickups', data);
      console.log('📡 pickupsAPI.schedule response:', response.data); // ✅ Debug log
      return response.data;
    } catch (error) {
      console.error('📡 pickupsAPI.schedule error:', error); // ✅ Debug log
      throw error;
    }
  },

  getMy: async (status = '') => {
    const params = status ? `?status=${status}` : '';
    const response = await axios.get(`/pickups/my${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/pickups/${id}`);
    return response.data;
  },

  accept: async (id) => {
    const response = await axios.put(`/pickups/${id}/accept`);
    return response.data;
  },

  reject: async (id, reason) => {
    const response = await axios.put(`/pickups/${id}/reject`, { reason });
    return response.data;
  },

  complete: async (id, quantityCollected) => {
    const response = await axios.put(`/pickups/${id}/complete`, { quantityCollected });
    return response.data;
  },

  cancel: async (id) => {
    const response = await axios.put(`/pickups/${id}/cancel`);
    return response.data;
  },

  getCollectionPointPickups: async (status = '') => {
    const params = status ? `?status=${status}` : '';
    const response = await axios.get(`/pickups/collection-point/all${params}`);
    return response.data;
  }
};