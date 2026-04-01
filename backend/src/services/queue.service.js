import { webhookQueue } from '../config/queue.js';

export const enqueueWebhookJob = async (eventId) => {
  const job = await webhookQueue.add(
    'process-webhook',
    { eventId },
    {
      attempts: parseInt(process.env.MAX_JOB_ATTEMPTS) || 3,
      backoff: {
        type: 'exponential',
        delay: parseInt(process.env.JOB_BACKOFF_DELAY) || 5000,
      },
      removeOnComplete: { count: 1000 },
      removeOnFail: false,
    }
  );
  return job;
};

export const getQueueStats = async () => {
  return webhookQueue.getJobCounts();
};
