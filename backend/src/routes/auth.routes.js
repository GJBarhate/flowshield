import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../validators/auth.validator.js';
import { protect } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

// POST /api/auth/register
// Body: { name, email, password }
// Response 201: { success: true, data: { user: { _id, name, email }, token } }
router.post('/register', ...validateRegister, register);

// POST /api/auth/login
// Body: { email, password }
// Response 200: { success: true, data: { user, token } }
router.post('/login', authLimiter, ...validateLogin, login);

// GET /api/auth/me
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { user } }
router.get('/me', protect, getMe);

export default router;
