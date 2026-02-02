// backend/src/controllers/investmentGoalController.js

const InvestmentGoal = require('../models/InvestmentGoal');

exports.getGoals = async (req, res) => {
  try {
    const goals = await InvestmentGoal.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(goals);
  } catch (err) {
    console.error('Get goals error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addGoal = async (req, res) => {
  try {
    const goal = new InvestmentGoal({
      ...req.body,
      userId: req.user.userId,
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    console.error('Add goal error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
