const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },

  holdings: [
    {
      stockId: { type: Number, required: true },
      symbol: { type: String, required: true },
      quantity: { type: Number, required: true },
      avgBuyPrice: { type: Number, required: true },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
