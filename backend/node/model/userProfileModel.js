const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);
