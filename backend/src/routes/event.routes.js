import { Router } from 'express';
import {
  getRecentEvents,
  getProjectEvents,
  getProjectStats,
  retryEvent,
} from '../controllers/event.controller.js';
import { validateEventQuery, validateEventId } from '../validators/event.validator.js';
import { validateProjectId } from '../validators/project.validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/events/recent
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { events: [...] } }
router.get('/recent', protect, getRecentEvents);

// GET /api/events/:projectId/stats
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { stats: { total, success, failed, pending } } }
router.get('/:projectId/stats', protect, ...validateProjectId, getProjectStats);

// GET /api/events/:projectId?page=1&limit=20&status=failed
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { events, pagination } }
router.get('/:projectId', protect, ...validateProjectId, ...validateEventQuery, getProjectEvents);

// POST /api/events/:eventId/retry
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { event, message } }
router.post('/:eventId/retry', protect, ...validateEventId, retryEvent);

export default router;
