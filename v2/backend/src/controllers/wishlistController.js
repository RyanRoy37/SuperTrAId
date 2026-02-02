// backend/src/controllers/wishlistController.js

const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: req.user.userId,
        stocks: [],
      });
    }

    res.json(wishlist);
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addToWishlist = async (req, res) => {
  const { stockId, symbol } = req.body;

  if (!stockId || !symbol) {
    return res.status(400).json({ message: 'Invalid stock data' });
  }

  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user.userId,
        stocks: [],
      });
    }

    const exists = wishlist.stocks.some(s => s.stockId === stockId);
    if (exists) {
      return res.status(400).json({ message: 'Stock already in wishlist' });
    }

    wishlist.stocks.push({ stockId, symbol });
    await wishlist.save();

    res.json(wishlist);
  } catch (err) {
    console.error('Add wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
