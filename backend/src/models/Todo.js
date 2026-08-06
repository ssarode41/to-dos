const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'DONE'], default: 'OPEN' },
  category: { type: String, default: 'GENERAL' },
  dueDate: { type: Date, default: null },
  completed: { type: Boolean, default: false },
  createdBy: { type: String, default: 'admin' },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now }
}, { timestamps: false });

module.exports = mongoose.model('Todo', todoSchema);
