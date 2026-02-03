const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
  tradingPurpose: { type: String, enum: ['learning', 'swing', 'long-term'], default: 'learning' },
  virtualCapital: { type: Number, default: 100000 },
  availableCapital: { type: Number, default: 100000 },
  riskPreference: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);