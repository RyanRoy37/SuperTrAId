// backend/src/controllers/authController.js
const pool = require('../config/postgres');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { initializeUserData } = require('../services/userInitializer');

exports.signup = async (req, res) => {
  const { email, password, purpose, capital, risk } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    // Check existing user
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create auth user (Postgres)
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, created_at)
       VALUES ($1, $2, NOW())
       RETURNING id`,
      [email, hash]
    );

    const userId = result.rows[0].id;

    // 🔥 Initialize ALL Mongo data
    await initializeUserData({
      userId,
      purpose,
      risk,
      capital,
    });

    res.status(201).json({
      message: 'Signup successful',
      userId,
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRes = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
