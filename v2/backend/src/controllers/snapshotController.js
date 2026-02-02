const PortfolioSnapshot = require('../models/PortfolioSnapshot');

exports.getSnapshots = async (req, res) => {
  try {
    const snapshots = await PortfolioSnapshot.find({
      userId: req.user.userId,
    })
      .sort({ date: 1 });

    res.json(snapshots);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
