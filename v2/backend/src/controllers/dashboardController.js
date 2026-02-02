// backend/src/controllers/dashboardController.js

const pool = require('../config/postgres');
const UserProfile = require('../models/UserProfile');
const Portfolio = require('../models/Portfolio');
const ActivityLog = require('../models/ActivityLog');

exports.getDashboard = async (req, res) => {
  const userId = req.user.userId;

  try {
    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const portfolio = await Portfolio.findOne({ userId });
    const holdings = portfolio?.holdings || [];

    let portfolioValue = 0;
    let holdingsWithValue = [];

    if (holdings.length > 0) {
      const stockIds = holdings.map(h => h.stockId);

      const priceResult = await pool.query(
        `
        SELECT DISTINCT ON (stock_id)
          stock_id,
          close
        FROM historical_prices
        WHERE stock_id = ANY($1)
        ORDER BY stock_id, date DESC
        `,
        [stockIds]
      );

      const priceMap = {};
      priceResult.rows.forEach(r => {
        priceMap[r.stock_id] = Number(r.close);
      });

      holdingsWithValue = holdings.map(h => {
        const currentPrice = priceMap[h.stockId] || 0;
        const value = h.quantity * currentPrice;
        portfolioValue += value;

        return {
          ...h,
          currentPrice,
          value,
          pnl: value - h.quantity * h.avgBuyPrice,
        };
      });
    }

    const activities = await ActivityLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      wallet: {
        balance: profile.wallet.balance,
        invested: profile.wallet.invested,
      },
      portfolio: {
        currentValue: portfolioValue,
        unrealizedPnL: portfolioValue - profile.wallet.invested,
        holdings: holdingsWithValue,
      },
      activities,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
