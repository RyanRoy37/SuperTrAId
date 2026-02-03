const mongoose = require('mongoose');

const portfolioSnapshotSchema = new mongoose.Schema({
  userId: { type: Number, required: true, index: true },
  totalValue: { type: Number, required: true },
  totalInvested: { type: Number, required: true },
  totalPL: { type: Number, required: true },
  holdings: [{ type: mongoose.Schema.Types.Mixed }],
  createdAt: { type: Date, default: Date.now }
});

portfolioSnapshotSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('PortfolioSnapshot', portfolioSnapshotSchema);