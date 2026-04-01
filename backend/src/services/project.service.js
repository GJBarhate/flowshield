import Project from '../models/Project.model.js';
import Event from '../models/Event.model.js';
import { generateApiKey } from '../utils/generateApiKey.js';
import AppError from '../utils/AppError.js';

export const getUserProjects = async (userId) => {
  return Project.find({ userId }).sort({ createdAt: -1 }).lean({ virtuals: true });
};

export const createProject = async (userId, name, description = '') => {
  const apiKey = generateApiKey();
  const project = await Project.create({ userId, name, description, apiKey });
  return project.toJSON();
};

export const deleteProject = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Cascade delete all events for this project
  await Event.deleteMany({ projectId });
  await project.deleteOne();

  return { deleted: true };
};

export const regenerateApiKey = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  project.apiKey = generateApiKey();
  await project.save();
  return project.toJSON();
};
