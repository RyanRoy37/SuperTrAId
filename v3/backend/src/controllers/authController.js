const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pgPool } = require('../config/db');
const UserProfile = require('../models/UserProfile');
const ActivityLog = require('../models/ActivityLog');

exports.signup = async (req, res) => {
  const { email, password, tradingPurpose, virtualCapital, riskPreference } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pgPool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );

    const user = result.rows[0];

    await UserProfile.create({
      userId: user.id,
      email: user.email,
      tradingPurpose: tradingPurpose || 'learning',
      virtualCapital: virtualCapital || 100000,
      availableCapital: virtualCapital || 100000,
      riskPreference: riskPreference || 'medium'
    });

    await ActivityLog.create({
      userId: user.id,
      action: 'USER_SIGNUP',
      details: { email: user.email }
    });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pgPool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await ActivityLog.create({
      userId: user.id,
      action: 'USER_LOGIN',
      details: { email: user.email }
    });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};