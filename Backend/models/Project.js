const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Created', 'Pending', 'Completed'],
    default: 'Pending',
  },
  sourceUpload: {
    type: String,
  },
  tmxUpload: {
    type: String,
  },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
