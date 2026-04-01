import Redis from 'ioredis';
import logger from './logger.js';

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: 3,
};

if (process.env.REDIS_PASSWORD) {
  redisOptions.password = process.env.REDIS_PASSWORD;
}

const redis = new Redis(redisOptions);

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', (err) => {
  logger.error('Redis error:', err.message);
  // Non-fatal: do not crash the process
});

redis.on('reconnecting', () => {
  logger.warn('Redis reconnecting...');
});

export const connectRedis = async () => {
  // ioredis connects automatically; this function exists for explicit await in worker.js
  return new Promise((resolve, reject) => {
    if (redis.status === 'ready') {
      resolve();
      return;
    }
    redis.once('ready', resolve);
    redis.once('error', (err) => {
      logger.warn('Redis initial connection error (non-fatal):', err.message);
      resolve(); // Resolve anyway; errors are non-fatal
    });
  });
};

export default redis;
