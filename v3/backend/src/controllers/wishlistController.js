const Wishlist = require('../models/Wishlist');
const { paginate, paginateResponse } = require('../utils/pagination');

exports.addToWishlist = async (req, res) => {
  const { stockId, symbol } = req.body;

  try {
    await Wishlist.create({
      userId: req.user.id,
      stockId,
      symbol
    });

    res.status(201).json({ message: 'Added to wishlist' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Already in wishlist' });
    }
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    const total = await Wishlist.countDocuments({ userId: req.user.id });
    const wishlist = await Wishlist.find({ userId: req.user.id })
      .skip(skip)
      .limit(limitNum)
      .sort({ addedAt: -1 });

    res.json(paginateResponse(wishlist, total, page, limit));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { stockId } = req.params;

  try {
    await Wishlist.deleteOne({ userId: req.user.id, stockId });
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};