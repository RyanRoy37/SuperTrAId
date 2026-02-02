// Wishlist Model: MongoDB
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  stocks: [
    {
      stockId: Number,
      symbol: String,
      companyName: String,
      exchange: String,
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
