import { Router } from 'express';
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';
import eventRoutes from './event.routes.js';
import webhookRoutes from './webhook.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/events', eventRoutes);
router.use('/webhook', webhookRoutes);

export default router;
