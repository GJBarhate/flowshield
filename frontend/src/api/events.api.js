import api from './axios.js';

/**
 * Get events for a project with optional filters
 * @param {string} projectId
 * @param {{ status?: string, page?: number, limit?: number, startDate?: string, endDate?: string }} params
 * @returns {Promise<{events: Array, pagination: object}>}
 */
export const getEvents = async (projectId, params = {}) => {
  const { data } = await api.get(`/events/${projectId}`, { params });
  return data.data;
};

/**
 * Get recent events across all projects
 * @returns {Promise<Array>}
 */
export const getRecentEvents = async () => {
  const { data } = await api.get('/events/recent');
  return data.data.events;
};

/**
 * Retry a failed event
 * @param {string} eventId
 * @returns {Promise<object>}
 */
export const retryEvent = async (eventId) => {
  const { data } = await api.post(`/events/${eventId}/retry`);
  return data.data;
};

/**
 * Get stats for a specific project
 * @param {string} projectId
 * @returns {Promise<object>}
 */
export const getEventStats = async (projectId) => {
  const { data } = await api.get(`/events/${projectId}/stats`);
  return data.data.stats;
};
