import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.middleware.js';

export const validateCreateProject = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be 3-50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  validate,
];

export const validateProjectId = [
  param('projectId').isMongoId().withMessage('Invalid project ID'),
  validate,
];
