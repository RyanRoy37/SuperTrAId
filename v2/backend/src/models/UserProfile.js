const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: Number, // Postgres user id
    required: true,
    unique: true,
    index: true,
  },

  purpose: {
    type: String,
    required: true,
  },

  risk: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },

  wallet: {
    balance: {
      type: Number,
      required: true,
    },
    invested: {
      type: Number,
      default: 0,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
