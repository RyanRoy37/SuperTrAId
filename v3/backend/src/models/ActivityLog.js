const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: Number, required: true, index: true },
  action: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

activityLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);