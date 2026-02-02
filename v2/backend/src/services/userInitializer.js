const UserProfile = require('../models/UserProfile');
const Portfolio = require('../models/Portfolio');
const ActivityLog = require('../models/ActivityLog');
const InvestmentGoal = require('../models/InvestmentGoal');

exports.initializeUserData = async ({
  userId,
  purpose = null,
  risk = null,
  capital = 0,
}) => {
  // Profile + Wallet
  await UserProfile.create({
    userId,
    purpose,
    risk,
    wallet: {
      balance: Number(capital) || 0,
      invested: 0,
    },
  });

  // Empty Portfolio
  await Portfolio.create({
    userId,
    holdings: [],
  });

  // Empty Goals (optional baseline)
  await InvestmentGoal.create({
    userId,
    title: 'Default',
    targetAmount: 0,
    currentAmount: 0,
    status: 'EMPTY',
  });

  // Initial Activity
  await ActivityLog.create({
    userId,
    action: 'ACCOUNT_INITIALIZED',
    details: {
      initialCapital: Number(capital) || 0,
    },
  });
};
