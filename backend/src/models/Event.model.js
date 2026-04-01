import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'projectId is required'],
    index: true,
  },
  eventId: {
    type: String,
    default: null,
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Payload is required'],
  },
  headers: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'success', 'failed', 'retrying'],
    default: 'pending',
  },
  responseCode: {
    type: Number,
    default: null,
  },
  error: {
    type: String,
    default: null,
  },
  retryCount: {
    type: Number,
    default: 0,
  },
  maxRetries: {
    type: Number,
    default: 3,
  },
  jobId: {
    type: String,
    default: null,
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
    default: null,
  },
  duration: {
    type: Number,
    default: null,
  },
});

// Indexes
eventSchema.index({ projectId: 1, receivedAt: -1 });
eventSchema.index({ projectId: 1, status: 1 });
eventSchema.index({ eventId: 1 }, { sparse: true });
eventSchema.index({ receivedAt: -1 });

// Static: getStats
eventSchema.statics.getStats = async function (projectId) {
  const result = await this.aggregate([
    { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const stats = { total: 0, success: 0, failed: 0, pending: 0, retrying: 0, processing: 0 };
  for (const item of result) {
    stats[item._id] = item.count;
    stats.total += item.count;
  }
  return stats;
};

// Static: getRecentEvents — joins projects to verify user ownership
eventSchema.statics.getRecentEvents = async function (userId) {
  return this.aggregate([
    {
      $lookup: {
        from: 'projects',
        localField: 'projectId',
        foreignField: '_id',
        as: 'project',
      },
    },
    { $unwind: '$project' },
    {
      $match: {
        'project.userId': new mongoose.Types.ObjectId(userId),
      },
    },
    { $sort: { receivedAt: -1 } },
    { $limit: 10 },
    {
      $project: {
        projectId: 1,
        eventId: 1,
        payload: 1,
        status: 1,
        retryCount: 1,
        receivedAt: 1,
        processedAt: 1,
        duration: 1,
        error: 1,
        responseCode: 1,
        'project.name': 1,
        'project._id': 1,
      },
    },
  ]);
};

eventSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
