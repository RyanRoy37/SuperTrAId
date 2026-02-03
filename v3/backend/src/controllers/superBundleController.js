const SuperBundle = require('../models/SuperBundle');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const UserProfile = require('../models/UserProfile');
const ActivityLog = require('../models/ActivityLog');
const { pgPool } = require('../config/db');
const { paginate, paginateResponse } = require('../utils/pagination');

exports.createBundle = async (req, res) => {
  const { name, description, stockIds } = req.body;
  const userId = req.user.id;

  try {
    const stocksQuery = await pgPool.query(`
      SELECT s.id, s.symbol, hp.close as latest_price
      FROM stocks s
      INNER JOIN LATERAL (
        SELECT close 
        FROM historical_prices 
        WHERE stock_id = s.id 
        ORDER BY date DESC 
        LIMIT 1
      ) hp ON true
      WHERE s.id = ANY($1)
    `, [stockIds]);

    if (stocksQuery.rows.length === 0) {
      return res.status(400).json({ error: 'No valid stocks with price data found' });
    }

    const stocks = stocksQuery.rows.map(s => ({
      stockId: s.id,
      symbol: s.symbol
    }));

    const totalPrice = stocksQuery.rows.reduce((sum, s) => sum + parseFloat(s.latest_price || 0), 0);

    const bundle = await SuperBundle.create({
      name,
      description,
      stocks,
      createdBy: userId,
      totalPrice
    });

    await ActivityLog.create({
      userId,
      action: 'CREATE_BUNDLE',
      details: { bundleName: name, stockCount: stocks.length }
    });

    res.status(201).json(bundle);
  } catch (error) {
    console.error('Bundle create error:', error);
    res.status(500).json({ error: 'Failed to create bundle' });
  }
};

exports.getBundles = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    const total = await SuperBundle.countDocuments({ createdBy: req.user.id });
    const bundles = await SuperBundle.find({ createdBy: req.user.id })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    res.json(paginateResponse(bundles, total, page, limit));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bundles' });
  }
};

exports.buyBundle = async (req, res) => {
  const { bundleId } = req.params;
  const userId = req.user.id;

  try {
    const bundle = await SuperBundle.findById(bundleId);
    if (!bundle) {
      return res.status(404).json({ error: 'Bundle not found' });
    }

    const stockIds = bundle.stocks.map(s => s.stockId);
    const stocksQuery = await pgPool.query(`
      SELECT s.id, s.symbol, hp.close as latest_price
      FROM stocks s
      INNER JOIN LATERAL (
        SELECT close 
        FROM historical_prices 
        WHERE stock_id = s.id 
        ORDER BY date DESC 
        LIMIT 1
      ) hp ON true
      WHERE s.id = ANY($1)
    `, [stockIds]);

    const totalCost = stocksQuery.rows.reduce((sum, s) => sum + parseFloat(s.latest_price || 0), 0);
    
    const profile = await UserProfile.findOne({ userId });
    if (profile.availableCapital < totalCost) {
      return res.status(400).json({ error: 'Insufficient capital' });
    }

    for (const stock of stocksQuery.rows) {
      const price = parseFloat(stock.latest_price);
      
      await Transaction.create({
        userId,
        stockId: stock.id,
        symbol: stock.symbol,
        type: 'BUY',
        quantity: 1,
        price,
        totalAmount: price,
        bundleId: bundle._id
      });

      const existing = await Portfolio.findOne({ userId, stockId: stock.id });

      if (existing) {
        const newQuantity = existing.quantity + 1;
        const newAvgPrice = (existing.totalInvested + price) / newQuantity;
        
        existing.quantity = newQuantity;
        existing.avgBuyPrice = newAvgPrice;
        existing.totalInvested += price;
        existing.currentPrice = price;
        existing.currentValue = newQuantity * price;
        existing.unrealizedPL = existing.currentValue - existing.totalInvested;
        await existing.save();
      } else {
        await Portfolio.create({
          userId,
          stockId: stock.id,
          symbol: stock.symbol,
          quantity: 1,
          avgBuyPrice: price,
          currentPrice: price,
          totalInvested: price,
          currentValue: price,
          unrealizedPL: 0
        });
      }
    }

    profile.availableCapital -= totalCost;
    await profile.save();

    await ActivityLog.create({
      userId,
      action: 'BUY_BUNDLE',
      details: { bundleName: bundle.name, totalCost }
    });

    res.json({ message: 'Bundle purchased successfully' });
  } catch (error) {
    console.error('Bundle buy error:', error);
    res.status(500).json({ error: 'Failed to buy bundle' });
  }
};