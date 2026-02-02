// backend/src/controllers/profileController.js

const UserProfile = require('../models/UserProfile');
const Portfolio = require('../models/Portfolio');
const ActivityLog = require('../models/ActivityLog');

// Create profile (called after signup)
exports.createProfile = async (req, res) => {
  const { purpose, capital, risk } = req.body;
  const userId = req.user.userId;

  if (!purpose || !capital || !risk) {
    return res.status(400).json({ message: 'Missing profile fields' });
  }

  try {
    const existing = await UserProfile.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const profile = new UserProfile({
      userId,
      purpose,
      risk,
      wallet: {
        balance: Number(capital),
        invested: 0,
      },
    });

    await profile.save();

    await Portfolio.create({
      userId,
      holdings: [],
    });

    await ActivityLog.create({
      userId,
      action: 'PROFILE_CREATED',
      details: {
        purpose,
        risk,
        initialCapital: Number(capital),
      },
    });

    res.status(201).json(profile);
  } catch (err) {
    console.error('Create profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get logged-in user's profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
