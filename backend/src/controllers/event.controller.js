import * as eventService from '../services/event.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

// GET /api/events/recent
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { events: [...] } }
export const getRecentEvents = asyncHandler(async (req, res) => {
  const events = await eventService.getRecentEvents(req.user._id);
  sendSuccess(res, { events }, 200, 'Recent events retrieved');
});

// GET /api/events/:projectId?page=1&limit=20&status=failed
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { events, pagination } }
export const getProjectEvents = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { page, limit, status, startDate, endDate } = req.query;

  const result = await eventService.getProjectEvents(projectId, req.user._id, {
    page,
    limit,
    status,
    startDate,
    endDate,
  });

  sendSuccess(res, result, 200, 'Events retrieved');
});

// GET /api/events/:projectId/stats
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { stats: { total, success, failed, pending } } }
export const getProjectStats = asyncHandler(async (req, res) => {
  const stats = await eventService.getProjectStats(req.params.projectId, req.user._id);
  sendSuccess(res, { stats }, 200, 'Stats retrieved');
});

// POST /api/events/:eventId/retry
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { event, message } }
export const retryEvent = asyncHandler(async (req, res) => {
  const event = await eventService.retryEvent(req.params.eventId, req.user._id);
  sendSuccess(res, { event, message: 'Event queued for retry' }, 200, 'Retry queued');
});
