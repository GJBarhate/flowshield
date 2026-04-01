import { param, query } from 'express-validator';
import { validate } from '../middleware/validate.middleware.js';

export const validateEventQuery = [
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt()
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['pending', 'success', 'failed', 'retrying', 'processing'])
    .withMessage('Invalid status value'),
  validate,
];

export const validateEventId = [
  param('eventId').isMongoId().withMessage('Invalid event ID'),
  validate,
];
