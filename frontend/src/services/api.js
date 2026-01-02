import axios from 'axios';

/**
 * API SERVICE – VERCEL + RENDER SAFE
 */

// Backend URL (must be full URL in production)
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

if (!BACKEND_URL) {
  console.error(
    '❌ REACT_APP_BACKEND_URL is NOT defined. Check Vercel Environment Variables.'
  );
}

// Create Axios instance
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
});

// Attach token if exists
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('admin_token') ||
      localStorage.getItem('adminToken') ||
      localStorage.getItem('client_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      '[API Request]',
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();

      const path = window.location.pathname;
      if (path.includes('/client')) {
        window.location.href = '/client/login';
      } else {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
