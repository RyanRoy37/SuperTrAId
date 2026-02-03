const UserProfile = require('../models/UserProfile');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const ActivityLog = require('../models/ActivityLog');
const SuperBundle = require('../models/SuperBundle');
const InvestmentGoal = require('../models/InvestmentGoal');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    let profile = await UserProfile.findOne({ userId });
    
    if (!profile) {
      profile = await UserProfile.create({
        userId: userId,
        email: req.user.email,
        virtualCapital: 100000,
        availableCapital: 100000,
        tradingPurpose: 'learning',
        riskPreference: 'medium'
      });
    }

    const portfolio = await Portfolio.find({ userId });
    
    const totalValue = portfolio.reduce((sum, p) => sum + (p.currentValue || 0), 0);
    const totalInvested = portfolio.reduce((sum, p) => sum + (p.totalInvested || 0), 0);
    const totalPL = totalValue - totalInvested;

    const recentActivity = await ActivityLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const bundles = await SuperBundle.find({ createdBy: userId });
    const goals = await InvestmentGoal.find({ userId, status: 'active' });

    res.json({
      virtualCapital: profile.virtualCapital || 0,
      availableCapital: profile.availableCapital || 0,
      portfolioValue: totalValue,
      totalInvested,
      profitLoss: totalPL,
      profitLossPercentage: totalInvested > 0 ? ((totalPL / totalInvested) * 100).toFixed(2) : 0,
      holdingsCount: portfolio.length,
      bundlesCount: bundles.length,
      goals: goals.length,
      recentActivity: recentActivity.slice(0, 5)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};