import Event from '../models/Event.model.js';
import { enqueueWebhookJob } from '../services/queue.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import logger from '../config/logger.js';

// POST /api/webhook/:projectId
// Header: x-api-key: fshield_<uuid>
// Body: any JSON
// Response 202: { success: true, data: { message, eventId, status } }
export const receiveWebhook = asyncHandler(async (req, res) => {
  const project = req.project; // Attached by validateApiKey middleware

  // Idempotency check
  const xEventId = req.headers['x-event-id'] || null;
  if (xEventId) {
    const existing = await Event.findOne({ eventId: xEventId, projectId: project._id });
    if (existing) {
      return sendSuccess(
        res,
        { message: 'Event already received', eventId: existing._id },
        200,
        'Duplicate event'
      );
    }
  }

  // Create event document
  const event = await Event.create({
    projectId: project._id,
    eventId: xEventId,
    payload: req.body,
    headers: {
      contentType: req.headers['content-type'] || null,
      userAgent: req.headers['user-agent'] || null,
      xEventId: xEventId,
      xGithubEvent: req.headers['x-github-event'] || null,
    },
    status: 'pending',
  });

  logger.info(`Webhook received for project ${project._id}, eventId: ${event._id}`);

  // Enqueue job
  const job = await enqueueWebhookJob(event._id.toString());

  // Save jobId back to event
  event.jobId = job.id;
  await event.save();

  sendSuccess(
    res,
    { message: 'Webhook received', eventId: event._id, status: 'pending' },
    202,
    'Webhook accepted'
  );
});
