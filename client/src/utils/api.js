import axios from 'axios';

const api = axios.create({
  baseURL: typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    ? 'https://park-plus-1gxx.vercel.app/api' 
    : 'http://localhost:5000/api',
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
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('parkplus_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;