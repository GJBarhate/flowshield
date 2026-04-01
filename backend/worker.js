import 'dotenv/config';
import { Worker } from 'bullmq';
import { connectDB } from './src/config/db.js';
import { connectRedis } from './src/config/redis.js';
import { processWebhookJob } from './src/services/worker.service.js';
import logger from './src/config/logger.js';

const QUEUE_NAME = process.env.QUEUE_NAME || 'flowshield-webhooks';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
};
if (process.env.REDIS_PASSWORD) {
  connection.password = process.env.REDIS_PASSWORD;
}

const start = async () => {
  await connectDB();
  await connectRedis();

  const worker = new Worker(QUEUE_NAME, processWebhookJob, {
    connection,
    concurrency: 5,
    limiter: { max: 50, duration: 1000 },
  });

  worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed: ${err.message}`);
  });

  worker.on('stalled', (jobId) => {
    logger.warn(`Job ${jobId} stalled`);
  });

  worker.on('error', (err) => {
    logger.error('Worker error:', err.message);
  });

  logger.info(`FlowShield worker started on queue "${QUEUE_NAME}", waiting for jobs...`);
};

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection in worker:', err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception in worker:', err.message);
  process.exit(1);
});

start();
