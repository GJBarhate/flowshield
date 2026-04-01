import { Queue } from 'bullmq';
import logger from './logger.js';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
};

if (process.env.REDIS_PASSWORD) {
  connection.password = process.env.REDIS_PASSWORD;
}

export const webhookQueue = new Queue(
  process.env.QUEUE_NAME || 'flowshield-webhooks',
  {
    connection,
    defaultJobOptions: {
      attempts: parseInt(process.env.MAX_JOB_ATTEMPTS) || 3,
      backoff: {
        type: 'exponential',
        delay: parseInt(process.env.JOB_BACKOFF_DELAY) || 5000,
      },
      removeOnComplete: { count: 1000 },
      removeOnFail: false,
    },
  }
);

webhookQueue.on('error', (err) => {
  logger.error('BullMQ Queue error:', err.message);
});

export const getQueueStats = async () => {
  return webhookQueue.getJobCounts();
};
