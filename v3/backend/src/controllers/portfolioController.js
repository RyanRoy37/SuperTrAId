const Portfolio = require('../models/Portfolio');
const { paginate, paginateResponse } = require('../utils/pagination');

exports.getPortfolio = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    const total = await Portfolio.countDocuments({ userId: req.user.id });
    const portfolio = await Portfolio.find({ userId: req.user.id })
      .skip(skip)
      .limit(limitNum)
      .sort({ updatedAt: -1 });

    res.json(paginateResponse(portfolio, total, page, limit));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};