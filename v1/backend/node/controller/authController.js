const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');
const UserProfile = require('../model/userProfileModel');
const Wallet = require('../model/walletModel');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const MIN_BALANCE = 1_000_000;

function generateToken(userId) {
  return jwt.sign(
    { user_id: userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

exports.register = async (req, res) => {
  const { email, password, confirmPassword, name, initialBalance } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  if (!initialBalance || initialBalance < MIN_BALANCE) {
    return res.status(400).json({
      message: `Minimum balance must be ₹${MIN_BALANCE}`
    });
  }

  const existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser(email, passwordHash);

  // Mongo: Profile
  await UserProfile.create({
    userId: user.id,
    email,
    name
  });

  // Mongo: Wallet
  await Wallet.create({
    userId: user.id,
    balance: initialBalance,
    initialBalance
  });

  const token = generateToken(user.id);

  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email
    }
  });
};
