const userModel = require('../model/userModel');

/**
 * GET /profile
 * Identity derived ONLY from JWT
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user_id;

    const profile = await userModel.getUserProfileById(userId);

    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /profile
 * Identity from JWT, data (if any) from body
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email } = req.body;

    // User sent NO update fields
    if (!email) {
      return res.status(400).json({
        message: 'No updatable fields provided'
      });
    }

    const updatedProfile = await userModel.updateUserEmail(userId, email);

    res.json(updatedProfile);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already in use' });
    }

    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
