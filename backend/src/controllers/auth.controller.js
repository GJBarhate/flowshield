import * as authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

// POST /api/auth/register
// Body: { name, email, password }
// Response 201: { success: true, data: { user: { _id, name, email }, token } }
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser(name, email, password);
  sendSuccess(res, result, 201, 'User registered successfully');
});

// POST /api/auth/login
// Body: { email, password }
// Response 200: { success: true, data: { user, token } }
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  sendSuccess(res, result, 200, 'Login successful');
});

// GET /api/auth/me
// Header: Authorization: Bearer <token>
// Response 200: { success: true, data: { user } }
export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: req.user }, 200, 'User retrieved');
});
