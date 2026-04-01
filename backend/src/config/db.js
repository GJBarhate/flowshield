import mongoose from 'mongoose';
import logger from './logger.js';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDB = async () => {
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      logger.info(
        `MongoDB connected: ${conn.connection.host} (mongoose v${mongoose.version})`
      );

      mongoose.connection.on('disconnected', async () => {
        logger.warn('MongoDB disconnected. Attempting reconnect...');
        await sleep(RETRY_DELAY_MS);
        try {
          await mongoose.connect(process.env.MONGODB_URI);
          logger.info('MongoDB reconnected successfully.');
        } catch (err) {
          logger.error('MongoDB reconnect failed:', err.message);
        }
      });

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err.message);
        if (process.env.NODE_ENV === 'production') {
          process.exit(1);
        }
      });

      return;
    } catch (err) {
      attempts++;
      logger.error(
        `MongoDB connection attempt ${attempts}/${MAX_RETRIES} failed: ${err.message}`
      );
      if (attempts < MAX_RETRIES) {
        logger.info(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await sleep(RETRY_DELAY_MS);
      } else {
        logger.error('All MongoDB connection attempts failed. Exiting.');
        process.exit(1);
      }
    }
  }
};
