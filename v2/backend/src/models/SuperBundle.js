const mongoose = require('mongoose');

const superBundleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  createdBy: {
    type: Number, // userId
    required: true,
  },

  stocks: [
    {
      stockId: { type: Number, required: true },
      symbol: { type: String, required: true },
      quantity: { type: Number, required: true }, // qty per bundle
    },
  ],

  isPublic: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SuperBundle', superBundleSchema);
