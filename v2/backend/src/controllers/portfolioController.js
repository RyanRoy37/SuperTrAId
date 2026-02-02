// backend/src/controllers/portfolioController.js

const Portfolio = require('../models/Portfolio');
const UserProfile = require('../models/UserProfile');
const ActivityLog = require('../models/ActivityLog');

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user.userId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (err) {
    console.error('Get portfolio error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.buyStock = async (req, res) => {
  const { stockId, symbol, quantity, price } = req.body;
  const userId = req.user.userId;

  if (!stockId || !symbol || !quantity || !price) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const profile = await UserProfile.findOne({ userId });
    const portfolio = await Portfolio.findOne({ userId });

    if (!profile || !portfolio) {
      return res.status(400).json({ message: 'User not initialized properly' });
    }

    const totalCost = quantity * price;

    if (profile.wallet.balance < totalCost) {
      await ActivityLog.create({
        userId,
        action: 'BUY_FAILED',
        details: { stockId, symbol, quantity, price, reason: 'INSUFFICIENT_BALANCE' },
      });
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    let holding = portfolio.holdings.find(h => h.stockId === stockId);

    if (holding) {
      const newQty = holding.quantity + quantity;
      holding.avgBuyPrice =
        (holding.avgBuyPrice * holding.quantity + price * quantity) / newQty;
      holding.quantity = newQty;
    } else {
      portfolio.holdings.push({
        stockId,
        symbol,
        quantity,
        avgBuyPrice: price,
      });
    }

    profile.wallet.balance -= totalCost;
    profile.wallet.invested += totalCost;

    await portfolio.save();
    await profile.save();

    await ActivityLog.create({
      userId,
      action: 'BUY_STOCK',
      details: { stockId, symbol, quantity, price },
    });

    res.json({ message: 'Stock bought', portfolio });
  } catch (err) {
    console.error('Buy stock error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sellStock = async (req, res) => {
  const { stockId, symbol, quantity, price } = req.body;
  const userId = req.user.userId;

  if (!stockId || !symbol || !quantity || !price) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const profile = await UserProfile.findOne({ userId });
    const portfolio = await Portfolio.findOne({ userId });

    if (!profile || !portfolio) {
      return res.status(400).json({ message: 'User not initialized properly' });
    }

    const holding = portfolio.holdings.find(h => h.stockId === stockId);

    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough holdings' });
    }

    holding.quantity -= quantity;

    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter(
        h => h.stockId !== stockId
      );
    }

    const proceeds = quantity * price;

    profile.wallet.balance += proceeds;
    profile.wallet.invested -= holding.avgBuyPrice * quantity;

    await portfolio.save();
    await profile.save();

    await ActivityLog.create({
      userId,
      action: 'SELL_STOCK',
      details: { stockId, symbol, quantity, price },
    });

    res.json({ message: 'Stock sold', portfolio });
  } catch (err) {
    console.error('Sell stock error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
