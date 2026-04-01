import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters'],
    default: '',
  },
  apiKey: {
    type: String,
    required: [true, 'API key is required'],
    unique: true,
    index: true,
  },
  eventCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save: update updatedAt
projectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual: webhookUrl
projectSchema.virtual('webhookUrl').get(function () {
  return `${process.env.BASE_URL || 'http://localhost:5000'}/api/webhook/${this._id}`;
});

// Compound index
projectSchema.index({ userId: 1, createdAt: -1 });

// toJSON: include virtuals, remove __v
projectSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
