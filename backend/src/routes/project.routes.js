import { Router } from 'express';
import {
  getProjects,
  createProject,
  deleteProject,
  regenerateApiKey,
} from '../controllers/project.controller.js';
import {
  validateCreateProject,
  validateProjectId,
} from '../validators/project.validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/projects
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { projects: [...] } }
router.get('/', protect, getProjects);

// POST /api/projects
// Header: Authorization: Bearer <token>
// Body: { name, description? }
// Response 201: { success: true, data: { project } }
router.post('/', protect, ...validateCreateProject, createProject);

// DELETE /api/projects/:projectId
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { message } }
router.delete('/:projectId', protect, ...validateProjectId, deleteProject);

// PATCH /api/projects/:projectId/regenerate-key
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { project } }
router.patch('/:projectId/regenerate-key', protect, ...validateProjectId, regenerateApiKey);

export default router;
