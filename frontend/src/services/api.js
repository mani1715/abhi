import axios from 'axios';

/**
 * CRITICAL FIX FOR MIXED CONTENT ERROR - FINAL SOLUTION
 * 
 * Issue: Axios was converting relative URLs to absolute HTTP URLs even with interceptors
 * Solution: Explicitly construct baseURL with current protocol to ensure HTTPS in production
 */

// Determine the correct base URL with protocol matching the current page
const getBaseURL = () => {
  // If we're on HTTPS, explicitly construct HTTPS URL
  // If we're on HTTP (local dev), use HTTP
  const protocol = window.location.protocol; // 'https:' or 'http:'
  const host = window.location.host; // 'api-secure-update.preview.emergentagent.com'
  
  // Construct full base URL with correct protocol
  const baseURL = `${protocol}//${host}/api`;
  
  console.log('[API Config] Page protocol:', protocol);
  console.log('[API Config] Constructed baseURL:', baseURL);
  
  return baseURL;
};

// Create axios instance with explicit HTTPS baseURL
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second default timeout
});

// Force axios to never convert to HTTP
axios.defaults.adapter = require('axios/lib/adapters/xhr');

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

// Add token to requests and ensure HTTPS protocol
api.interceptors.request.use(
  (config) => {
    // Check for both admin and client tokens
    const token = localStorage.getItem('admin_token') || 
                  localStorage.getItem('adminToken') || 
                  localStorage.getItem('client_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add /api prefix if not already present
    if (config.url && !config.url.startsWith('/api') && !config.url.startsWith('http')) {
      config.url = `/api${config.url}`;
    }
    
    // CRITICAL FIX FOR MIXED CONTENT ERROR
    // If the page is loaded over HTTPS, ensure API requests also use HTTPS
    if (window.location.protocol === 'https:') {
      // If config.url is an absolute URL with http://, convert it to https://
      if (config.url && config.url.startsWith('http://')) {
        config.url = config.url.replace('http://', 'https://');
        console.log('[API Security] Upgraded HTTP to HTTPS:', config.url);
      }
    }
    
    // Ensure we're using relative URLs, not absolute URLs
    // If somehow an absolute URL was constructed, convert it back to relative
    if (config.url && config.url.includes('://')) {
      const urlObj = new URL(config.url);
      // If the hostname matches current location, convert to relative URL
      if (urlObj.hostname === window.location.hostname) {
        config.url = urlObj.pathname + urlObj.search + urlObj.hash;
        console.log('[API Security] Converted to relative URL:', config.url);
      }
    }
    
    // Log for debugging
    console.log('[API Request]', config.method.toUpperCase(), config.url);
    
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
