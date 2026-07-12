import axios from 'axios';

// Create a custom axios instance with default settings
const api = axios.create({
  baseURL: '/api',  // All requests go to /api/...
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('parkplus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors globally (token expired → redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('parkplus_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;