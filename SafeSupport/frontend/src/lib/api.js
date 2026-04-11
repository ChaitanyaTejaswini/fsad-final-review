import axios from 'axios';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!rawApiBaseUrl) {
  throw new Error('Missing VITE_API_BASE_URL. Set it in frontend/.env');
}

const API_BASE_URL = `${rawApiBaseUrl.replace(/\/+$/, '')}/api`;

const isTrustedApiRequest = (url = '') => {
  try {
    const requestUrl = new URL(url, API_BASE_URL);
    const apiOrigin = new URL(API_BASE_URL).origin;
    return requestUrl.origin === apiOrigin;
  } catch {
    return false;
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && isTrustedApiRequest(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
