import * as projectService from '../services/project.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

// GET /api/projects
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { projects: [...] } }
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getUserProjects(req.user._id);
  sendSuccess(res, { projects }, 200, 'Projects retrieved');
});

// POST /api/projects
// Header: Authorization: Bearer <token>
// Body: { name, description? }
// Response 201: { success: true, data: { project } }
export const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const project = await projectService.createProject(req.user._id, name, description);
  sendSuccess(res, { project }, 201, 'Project created');
});

// DELETE /api/projects/:projectId
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { message } }
export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.params.projectId, req.user._id);
  sendSuccess(res, { message: 'Project deleted' }, 200, 'Project deleted successfully');
});

// PATCH /api/projects/:projectId/regenerate-key
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { project } }
export const regenerateApiKey = asyncHandler(async (req, res) => {
  const project = await projectService.regenerateApiKey(req.params.projectId, req.user._id);
  sendSuccess(res, { project }, 200, 'API key regenerated');
});
