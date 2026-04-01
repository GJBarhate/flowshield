import { Router } from 'express';
import { receiveWebhook } from '../controllers/webhook.controller.js';
import { validateApiKey } from '../middleware/apiKey.middleware.js';
import { webhookLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

// POST /api/webhook/:projectId
// Header: x-api-key: fshield_<uuid>
// Body: any JSON
// Response 202: { success: true, data: { message, eventId, status } }
router.post('/:projectId', webhookLimiter, validateApiKey, receiveWebhook);

export default router;
