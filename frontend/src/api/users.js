import axios from './axios';

export const usersAPI = {
  getProfile: async () => {
    const response = await axios.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await axios.put('/users/profile', userData);
    return response.data;
  },

  getDashboard: async () => {
    const response = await axios.get('/users/dashboard');
    return response.data;
  },

  getTransactions: async (page = 1, limit = 10) => {
    const response = await axios.get(`/users/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },

  getLeaderboard: async (city) => {
    const response = await axios.get(`/users/leaderboard/${city}`);
    return response.data;
  }
};