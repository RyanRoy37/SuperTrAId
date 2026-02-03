const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  balance: { type: Number, required: true },
  initialBalance: { type: Number, required: true },
  currency: { type: String, default: 'INR' }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
