import Project from '../models/Project.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

export const validateApiKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    throw new AppError('API key required', 401);
  }

  const project = await Project.findById(req.params.projectId);

  if (!project || project.apiKey !== apiKey) {
    throw new AppError('Invalid API key', 401);
  }
  // const project = await Project.findOne({
  //   apiKey,
  //   _id: req.params.projectId,
  // });

  // if (!project) {
  //   throw new AppError('Invalid API key', 401);
  // }

  if (project.isActive === false) {
    throw new AppError('Project is disabled', 403);
  }

  req.project = project;
  next();
});
