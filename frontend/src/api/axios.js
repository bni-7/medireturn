import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method.toUpperCase(), config.url, config.data); // ✅ Debug log
    
    // Try to get token from cookie first
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (cookieToken) {
      config.headers['Authorization'] = `Bearer ${cookieToken.split('=')[1]}`;
    } else {
      // Fallback to localStorage
      const localToken = localStorage.getItem('token');
      if (localToken) {
        config.headers['Authorization'] = `Bearer ${localToken}`;
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error); // ✅ Debug log
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url); // ✅ Debug log
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    }); // ✅ Debug log
    
    if (error.response?.status === 401) {
      // Clear both cookie and localStorage
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // ✅ Return the full error object, not just error.response.data
    return Promise.reject(error);
  }
);

export default api;