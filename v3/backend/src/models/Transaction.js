const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: Number, required: true, index: true },
  stockId: { type: Number, required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  bundleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperBundle' },
  createdAt: { type: Date, default: Date.now }
});

transactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);