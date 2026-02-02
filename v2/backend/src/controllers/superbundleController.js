// backend/src/controllers/superbundleController.js

const SuperBundle = require('../models/SuperBundle');
const Portfolio = require('../models/Portfolio');
const UserProfile = require('../models/UserProfile');
const ActivityLog = require('../models/ActivityLog');
const pool = require('../config/postgres');

// List public bundles
exports.getAllBundles = async (req, res) => {
  try {
    const bundles = await SuperBundle.find({ isPublic: true })
      .sort({ createdAt: -1 });
    res.json(bundles);
  } catch (err) {
    console.error('Get bundles error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bundle details
exports.getBundleById = async (req, res) => {
  try {
    const bundle = await SuperBundle.findById(req.params.id);
    if (!bundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }
    res.json(bundle);
  } catch (err) {
    console.error('Get bundle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create bundle
exports.createBundle = async (req, res) => {
  const { name, description, stocks, isPublic = true } = req.body;

  if (!name || !Array.isArray(stocks) || stocks.length === 0) {
    return res.status(400).json({ message: 'Invalid bundle data' });
  }

  try {
    const bundle = await SuperBundle.create({
      name,
      description,
      stocks,
      isPublic,
      createdBy: req.user.userId,
    });

    await ActivityLog.create({
      userId: req.user.userId,
      action: 'CREATE_SUPERBUNDLE',
      details: { bundleId: bundle._id, name },
    });

    res.status(201).json(bundle);
  } catch (err) {
    console.error('Create bundle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Buy bundle (atomic)
exports.buyBundle = async (req, res) => {
  const userId = req.user.userId;

  try {
    const bundle = await SuperBundle.findById(req.params.id);
    if (!bundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }

    const profile = await UserProfile.findOne({ userId });
    const portfolio = await Portfolio.findOne({ userId });

    if (!profile || !portfolio) {
      return res.status(400).json({ message: 'User not initialized properly' });
    }

    const stockIds = bundle.stocks.map(s => s.stockId);

    const priceRes = await pool.query(
      `
      SELECT DISTINCT ON (stock_id)
        stock_id, close
      FROM historical_prices
      WHERE stock_id = ANY($1)
      ORDER BY stock_id, date DESC
      `,
      [stockIds]
    );

    const priceMap = {};
    priceRes.rows.forEach(r => {
      priceMap[r.stock_id] = Number(r.close);
    });

    let totalCost = 0;
    for (const s of bundle.stocks) {
      if (!priceMap[s.stockId]) {
        return res.status(400).json({ message: 'Price unavailable for some stocks' });
      }
      totalCost += s.quantity * priceMap[s.stockId];
    }

    if (profile.wallet.balance < totalCost) {
      await ActivityLog.create({
        userId,
        action: 'BUY_SUPERBUNDLE_FAILED',
        details: {
          bundleId: bundle._id,
          reason: 'INSUFFICIENT_BALANCE',
          totalCost,
        },
      });
      return res.status(400).json({ message: 'Insufficient balance for bundle' });
    }

    for (const s of bundle.stocks) {
      const price = priceMap[s.stockId];
      const holding = portfolio.holdings.find(h => h.stockId === s.stockId);

      if (holding) {
        const newQty = holding.quantity + s.quantity;
        holding.avgBuyPrice =
          (holding.avgBuyPrice * holding.quantity + price * s.quantity) / newQty;
        holding.quantity = newQty;
      } else {
        portfolio.holdings.push({
          stockId: s.stockId,
          symbol: s.symbol,
          quantity: s.quantity,
          avgBuyPrice: price,
        });
      }
    }

    profile.wallet.balance -= totalCost;
    profile.wallet.invested += totalCost;

    await portfolio.save();
    await profile.save();

    await ActivityLog.create({
      userId,
      action: 'BUY_SUPERBUNDLE',
      details: {
        bundleId: bundle._id,
        name: bundle.name,
        totalCost,
      },
    });

    res.json({
      message: 'SuperBundle purchased successfully',
      totalCost,
      portfolio,
    });
  } catch (err) {
    console.error('Buy bundle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
