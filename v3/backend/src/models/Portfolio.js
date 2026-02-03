const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: Number, required: true, index: true },
  stockId: { type: Number, required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  avgBuyPrice: { type: Number, required: true },
  currentPrice: { type: Number, default: 0 },
  totalInvested: { type: Number, required: true },
  currentValue: { type: Number, default: 0 },
  unrealizedPL: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

portfolioSchema.index({ userId: 1, stockId: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);