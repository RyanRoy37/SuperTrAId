const InvestmentGoal = require('../models/InvestmentGoal');

exports.createGoal = async (req, res) => {
  const { goalName, targetAmount, deadline } = req.body;

  try {
    const goal = await InvestmentGoal.create({
      userId: req.user.id,
      goalName,
      targetAmount,
      deadline
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const goals = await InvestmentGoal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

exports.updateGoal = async (req, res) => {
  const { id } = req.params;
  const { currentAmount, status } = req.body;

  try {
    const goal = await InvestmentGoal.findOne({ _id: id, userId: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (currentAmount !== undefined) goal.currentAmount = currentAmount;
    if (status) goal.status = status;

    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

exports.deleteGoal = async (req, res) => {
  const { id } = req.params;

  try {
    const goal = await InvestmentGoal.findOneAndDelete({ _id: id, userId: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};