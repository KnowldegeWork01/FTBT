const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  projectName: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Created', 'Pending', 'Completed'],
    default: 'Created',
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
