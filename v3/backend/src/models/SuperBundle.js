const mongoose = require('mongoose');

const superBundleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  stocks: [{
    stockId: { type: Number, required: true },
    symbol: { type: String, required: true }
  }],
  createdBy: { type: Number, required: true },
  isPublic: { type: Boolean, default: false },
  totalPrice: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

superBundleSchema.index({ createdBy: 1 });

module.exports = mongoose.model('SuperBundle', superBundleSchema);