import api from './axios.js';

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
export const loginUser = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
};

/**
 * Register a new user
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
export const registerUser = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data.data;
};

/**
 * Get current authenticated user
 * @returns {Promise<{user: object}>}
 */
export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data;
};
