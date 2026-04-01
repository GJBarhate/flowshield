import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from './logger.js';

let io = null;

export const initSocket = (httpServer) => {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // JWT Authentication middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      logger.warn('Socket auth failed:', err.message);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    logger.info(`Socket connected: ${socket.id} (user: ${socket.userId})`);

    socket.on('join:project', async (projectId) => {
      try {
        // Lazy import to avoid circular deps at module load time
        const { default: Project } = await import('../models/Project.model.js');
        const project = await Project.findOne({
          _id: projectId,
          userId: socket.userId,
        });
        if (!project) {
          socket.emit('error', { message: 'Project not found or access denied' });
          return;
        }
        socket.join(`project:${projectId}`);
        socket.emit('joined:project', { projectId });
        logger.info(`Socket ${socket.id} joined project:${projectId}`);
      } catch (err) {
        logger.error('Socket join:project error:', err.message);
        socket.emit('error', { message: 'Failed to join project room' });
      }
    });

    socket.on('leave:project', (projectId) => {
      socket.leave(`project:${projectId}`);
      logger.info(`Socket ${socket.id} left project:${projectId}`);
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (reason: ${reason})`);
    });
  });

  logger.info('Socket.io initialized');
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Call initSocket(server) first.');
  }
  return io;
};
