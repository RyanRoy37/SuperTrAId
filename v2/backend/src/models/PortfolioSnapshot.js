const mongoose = require('mongoose');

const portfolioSnapshotSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true,
  },

  date: {
    type: String, // YYYY-MM-DD
    required: true,
    index: true,
  },

  walletBalance: {
    type: Number,
    required: true,
  },

  investedAmount: {
    type: Number,
    required: true,
  },

  portfolioValue: {
    type: Number,
    required: true,
  },

  unrealizedPnL: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// One snapshot per user per day
portfolioSnapshotSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('PortfolioSnapshot', portfolioSnapshotSchema);
