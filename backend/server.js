import 'dotenv/config';
import { createServer } from 'http';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { initSocket } from './src/config/socket.js';
import logger from './src/config/logger.js';

console.log("MONGO URI:", process.env.MONGODB_URI);
const PORT = parseInt(process.env.PORT) || 5000;

let httpServer;

const start = async () => {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Create HTTP server from Express app
  httpServer = createServer(app);

  // 3. Initialize Socket.io (stores io instance internally)
  initSocket(httpServer);

  // 4. Start listening
  httpServer.listen(PORT, () => {
    logger.info(`FlowShield server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

// ── Unhandled promise rejection
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection:', err.message);
  if (httpServer) {
    httpServer.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// ── Uncaught exception
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err.message);
  process.exit(1);
});

start();
