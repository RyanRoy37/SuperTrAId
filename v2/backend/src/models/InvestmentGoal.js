// Investment Goal Model: MongoDB
const mongoose = require('mongoose');

const investmentGoalSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  goal: String,
  targetAmount: Number,
  targetDate: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InvestmentGoal', investmentGoalSchema);
