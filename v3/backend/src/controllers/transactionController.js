const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const UserProfile = require('../models/UserProfile');
const ActivityLog = require('../models/ActivityLog');
const { pgPool } = require('../config/db');
const { paginate, paginateResponse } = require('../utils/pagination');

exports.buyStock = async (req, res) => {
  const { stockId, symbol, quantity } = req.body;
  const userId = req.user.id;

  try {
    const priceResult = await pgPool.query(
      'SELECT close FROM historical_prices WHERE stock_id = $1 ORDER BY date DESC LIMIT 1',
      [stockId]
    );

    if (priceResult.rows.length === 0) {
      return res.status(400).json({ error: 'No price data available for this stock' });
    }

    const price = parseFloat(priceResult.rows[0].close);
    const totalAmount = quantity * price;
    
    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(400).json({ error: 'User profile not found' });
    }

    if (profile.availableCapital < totalAmount) {
      return res.status(400).json({ error: 'Insufficient capital' });
    }

    await Transaction.create({
      userId,
      stockId,
      symbol,
      type: 'BUY',
      quantity,
      price,
      totalAmount
    });

    const existing = await Portfolio.findOne({ userId, stockId });

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      const newAvgPrice = (existing.totalInvested + totalAmount) / newQuantity;
      
      existing.quantity = newQuantity;
      existing.avgBuyPrice = newAvgPrice;
      existing.totalInvested += totalAmount;
      existing.currentPrice = price;
      existing.currentValue = newQuantity * price;
      existing.unrealizedPL = existing.currentValue - existing.totalInvested;
      await existing.save();
    } else {
      await Portfolio.create({
        userId,
        stockId,
        symbol,
        quantity,
        avgBuyPrice: price,
        currentPrice: price,
        totalInvested: totalAmount,
        currentValue: totalAmount,
        unrealizedPL: 0
      });
    }

    profile.availableCapital -= totalAmount;
    await profile.save();

    await ActivityLog.create({
      userId,
      action: 'BUY_STOCK',
      details: { symbol, quantity, price, totalAmount }
    });

    res.json({ message: 'Stock purchased successfully' });
  } catch (error) {
    console.error('Buy stock error:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
};

exports.sellStock = async (req, res) => {
  const { stockId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const holding = await Portfolio.findOne({ userId, stockId });

    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient holdings' });
    }

    const priceResult = await pgPool.query(
      'SELECT close FROM historical_prices WHERE stock_id = $1 ORDER BY date DESC LIMIT 1',
      [stockId]
    );

    if (priceResult.rows.length === 0) {
      return res.status(400).json({ error: 'No price data available for this stock' });
    }

    const price = parseFloat(priceResult.rows[0].close);
    const totalAmount = quantity * price;

    await Transaction.create({
      userId,
      stockId,
      symbol: holding.symbol,
      type: 'SELL',
      quantity,
      price,
      totalAmount
    });

    const profile = await UserProfile.findOne({ userId });
    profile.availableCapital += totalAmount;
    await profile.save();

    holding.quantity -= quantity;
    holding.totalInvested = holding.avgBuyPrice * holding.quantity;
    holding.currentValue = holding.quantity * price;
    holding.unrealizedPL = holding.currentValue - holding.totalInvested;

    if (holding.quantity === 0) {
      await Portfolio.deleteOne({ _id: holding._id });
    } else {
      await holding.save();
    }

    await ActivityLog.create({
      userId,
      action: 'SELL_STOCK',
      details: { symbol: holding.symbol, quantity, price, totalAmount }
    });

    res.json({ message: 'Stock sold successfully' });
  } catch (error) {
    console.error('Sell stock error:', error);
    res.status(500).json({ error: 'Sale failed' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    const total = await Transaction.countDocuments({ userId: req.user.id });
    const transactions = await Transaction.find({ userId: req.user.id })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    res.json(paginateResponse(transactions, total, page, limit));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};