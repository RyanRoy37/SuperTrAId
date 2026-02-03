const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: Number, required: true, index: true },
  stockId: { type: Number, required: true },
  symbol: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

wishlistSchema.index({ userId: 1, stockId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);