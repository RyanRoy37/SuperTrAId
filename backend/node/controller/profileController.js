const UserProfile = require('../model/userProfileModel');

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { name },
      { new: true }
    );

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile };
