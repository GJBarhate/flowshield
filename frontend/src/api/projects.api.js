import api from './axios.js';

/**
 * Get all projects for authenticated user
 * @returns {Promise<Array>}
 */
export const getProjects = async () => {
  const { data } = await api.get('/projects');
  return data.data.projects;
};

/**
 * Create a new project
 * @param {string} name
 * @param {string} [description]
 * @returns {Promise<object>}
 */
export const createProject = async (name, description = '') => {
  const { data } = await api.post('/projects', { name, description });
  return data.data.project;
};

/**
 * Delete a project by ID
 * @param {string} projectId
 * @returns {Promise<object>}
 */
export const deleteProject = async (projectId) => {
  const { data } = await api.delete(`/projects/${projectId}`);
  return data.data;
};

/**
 * Regenerate API key for a project
 * @param {string} projectId
 * @returns {Promise<object>}
 */
export const regenerateApiKey = async (projectId) => {
  const { data } = await api.patch(`/projects/${projectId}/regenerate-key`);
  return data.data.project;
};
