const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  stockId: { type: Number, required: true },
  symbol: String,
  type: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: Number,
  price: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
