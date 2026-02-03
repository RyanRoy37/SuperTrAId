const mongoose = require('mongoose');

const investmentGoalSchema = new mongoose.Schema({
  userId: { type: Number, required: true, index: true },
  goalName: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InvestmentGoal', investmentGoalSchema);