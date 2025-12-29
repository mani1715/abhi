import axios from 'axios';

/**
 * CRITICAL FIX FOR MIXED CONTENT ERROR - PRODUCTION READY SOLUTION
 * 
 * Issue: Mixed content error when HTTPS page tries to make HTTP API calls
 * Solution: Use empty baseURL and construct full URLs dynamically in request interceptor
 * This ensures the protocol always matches the current page (HTTP in dev, HTTPS in production)
 */

// Create axios instance with NO baseURL - we'll construct it dynamically per request
const api = axios.create({
  // NO baseURL here - will be constructed in interceptor
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second default timeout
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add token to requests and construct full URL with correct protocol
api.interceptors.request.use(
  (config) => {
    // CRITICAL: Construct the full URL with the current page's protocol
    // This ensures HTTP in development and HTTPS in production
    if (config.url && !config.url.startsWith('http://') && !config.url.startsWith('https://')) {
      const protocol = window.location.protocol; // 'https:' or 'http:'
      const host = window.location.host; // domain with port
      
      // Construct full URL with correct protocol
      // Example: '/client/projects' becomes 'https://code-medic-35.preview.emergentagent.com/api/client/projects'
      const fullUrl = `${protocol}//${host}${config.url.startsWith('/api') ? '' : '/api'}${config.url}`;
      config.url = fullUrl;
      
      console.log('[API] Constructed URL:', fullUrl);
    }
    
    // Check for both admin and client tokens
    const token = localStorage.getItem('admin_token') || 
                  localStorage.getItem('adminToken') || 
                  localStorage.getItem('client_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Security check: If we're on HTTPS, ensure we're not making HTTP requests
    if (window.location.protocol === 'https:' && config.url?.startsWith('http://')) {
      // Force upgrade HTTP to HTTPS
      config.url = config.url.replace('http://', 'https://');
      console.warn('[API Security] FORCED HTTP→HTTPS upgrade:', config.url);
    }
    
    console.log('[API Request]', config.method?.toUpperCase(), config.url);
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors with improved logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      const currentPath = window.location.pathname;
      
      // If already on login page, don't redirect
      if (currentPath.includes('/admin/login') || currentPath.includes('/client/login')) {
        return Promise.reject(error);
      }

      // Check if we have a token
      const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
      const clientToken = localStorage.getItem('client_token');
      
      if (!adminToken && !clientToken) {
        // No token, redirect to appropriate login based on current path
        if (currentPath.includes('/client')) {
          window.location.href = '/client/login';
        } else {
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }

      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Clear tokens and redirect to appropriate login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('client_token');
      localStorage.removeItem('client_data');
      
      processQueue(error, null);
      isRefreshing = false;
      
      // Small delay to prevent multiple redirects
      setTimeout(() => {
        if (currentPath.includes('/client')) {
          window.location.href = '/client/login';
        } else {
          window.location.href = '/admin/login';
        }
      }, 100);
      
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

export default api;
