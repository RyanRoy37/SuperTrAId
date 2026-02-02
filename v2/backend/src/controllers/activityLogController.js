// backend/src/controllers/activityLogController.js

const ActivityLog = require('../models/ActivityLog');

exports.getLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
