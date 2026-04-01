import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem('flowshield-auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore parse errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 + network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear persisted auth state
      try {
        const raw = localStorage.getItem('flowshield-auth');
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.state = { user: null, token: null, isAuthenticated: false };
          localStorage.setItem('flowshield-auth', JSON.stringify(parsed));
        }
      } catch {
        localStorage.removeItem('flowshield-auth');
      }
      window.location.href = '/login';
    }

    if (!error.response) {
      return Promise.reject(new Error('Network error — please check your connection.'));
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Something went wrong. Please try again.';

    return Promise.reject(new Error(message));
  }
);

export default api;
