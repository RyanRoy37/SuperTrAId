const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

function generateToken(userId) {
  return jwt.sign(
    { user_id: userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * POST /auth/register
 */
exports.register = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({
      message: 'Please fill all required fields'
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: 'Passwords do not match'
    });
  }

  const existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({
      message: 'User already exists'
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser(email, passwordHash);

  const token = generateToken(user.id);

  res.status(201).json({
    token,
    user
  });
};

/**
 * POST /auth/login
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    });
  }

  const user = await userModel.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({
      message: 'Invalid email or password'
    });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({
      message: 'Invalid email or password'
    });
  }

  const token = generateToken(user.id);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email
    }
  });
};
