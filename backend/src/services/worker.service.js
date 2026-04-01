import Event from '../models/Event.model.js';
import Project from '../models/Project.model.js';
import { getIO } from '../config/socket.js';
import logger from '../config/logger.js';

export const processWebhookJob = async (job) => {
  const { eventId } = job.data;

  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error(`Event not found: ${eventId}`);
  }

  // Mark as processing
  event.status = 'processing';
  await event.save();

  const startTime = Date.now();

  try {
    let responseCode = 200;

    if (event.payload && event.payload.targetUrl) {
      // Forward to target URL using native fetch (Node 18+)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(event.payload.targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event.payload),
          signal: controller.signal,
        });
        responseCode = response.status;
        if (!response.ok) {
          throw new Error(`Target URL responded with status ${response.status}`);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    const duration = Date.now() - startTime;

    await Event.findByIdAndUpdate(eventId, {
      status: 'success',
      processedAt: new Date(),
      responseCode,
      duration,
      error: null,
    });

    // Increment project eventCount
    await Project.findByIdAndUpdate(event.projectId, { $inc: { eventCount: 1 } });

    // Emit socket event
    const updatedEvent = await Event.findById(eventId).lean();
    try {
      getIO()
        .to(`project:${event.projectId}`)
        .emit('event:updated', updatedEvent);
    } catch (socketErr) {
      logger.warn('Socket emit skipped (not initialized in worker):', socketErr.message);
    }

    logger.info(`Job ${job.id} completed for event ${eventId}`);
    return updatedEvent;
  } catch (error) {
    const duration = Date.now() - startTime;

    await Event.findByIdAndUpdate(eventId, {
      status: 'failed',
      processedAt: new Date(),
      error: error.message,
      duration,
    });

    // Emit socket event for failure
    const updatedEvent = await Event.findById(eventId).lean();
    try {
      getIO()
        .to(`project:${event.projectId}`)
        .emit('event:updated', updatedEvent);
    } catch (socketErr) {
      logger.warn('Socket emit skipped (not initialized in worker):', socketErr.message);
    }

    // Re-throw so BullMQ can handle retries
    throw error;
  }
};
