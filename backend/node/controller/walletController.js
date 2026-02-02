const Wallet = require('../model/walletModel');

const getWallet = async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.user.id });
  res.json(wallet);
};

const updateWallet = async (req, res) => {
  const { balance } = req.body;

  if (balance < 1_000_000) {
    return res.status(400).json({ message: 'Below minimum balance' });
  }

  const wallet = await Wallet.findOneAndUpdate(
    { userId: req.user.id },
    { balance },
    { new: true }
  );

  res.json(wallet);
};

module.exports = { getWallet, updateWallet };
