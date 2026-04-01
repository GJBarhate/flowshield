import Event from '../models/Event.model.js';
import Project from '../models/Project.model.js';
import AppError from '../utils/AppError.js';
import { enqueueWebhookJob } from './queue.service.js';

export const getProjectEvents = async (
  projectId,
  userId,
  { page = 1, limit = 20, status, startDate, endDate } = {}
) => {
  // Verify ownership
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  const query = { projectId };
  if (status) query.status = status;
  if (startDate || endDate) {
    query.receivedAt = {};
    if (startDate) query.receivedAt.$gte = new Date(startDate);
    if (endDate) query.receivedAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [total, events] = await Promise.all([
    Event.countDocuments(query),
    Event.find(query).sort({ receivedAt: -1 }).skip(skip).limit(limit).lean(),
  ]);

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getProjectStats = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  return Event.getStats(projectId);
};

export const getRecentEvents = async (userId) => {
  return Event.getRecentEvents(userId);
};

export const retryEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId).populate('projectId');
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Verify ownership through project
  const project = event.projectId;
  if (!project || project.userId.toString() !== userId.toString()) {
    throw new AppError('Unauthorized', 403);
  }

  if (event.status !== 'failed') {
    throw new AppError('Only failed events can be retried', 400);
  }

  if (event.retryCount >= event.maxRetries) {
    throw new AppError('Max retries reached', 400);
  }

  event.status = 'retrying';
  event.retryCount += 1;
  await event.save();

  const job = await enqueueWebhookJob(event._id.toString());
  event.jobId = job.id;
  await event.save();

  return event;
};
