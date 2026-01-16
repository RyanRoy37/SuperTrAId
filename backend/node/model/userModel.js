const pool = require('../db');

async function findUserByEmail(email) {
  const res = await pool.query(
    `SELECT id, email, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );
  return res.rows[0];
}

async function createUser(email, passwordHash) {
  const res = await pool.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email, created_at`,
    [email, passwordHash]
  );
  return res.rows[0];
}

const getUserProfileById = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
      email,
      created_at AS joined_date
    FROM users
    WHERE id = $1
    `,
    [userId]
  );
  return result.rows[0];
};

const updateUserProfile = async (userId, { name, email }) => {
  const result = await pool.query(
    `
    UPDATE users
    SET 
      email = COALESCE($2, email)
    WHERE id = $3
    RETURNING email, created_at AS joined_date
    `,
    [name, email, userId]
  );
  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
   getUserProfileById,
  updateUserProfile
};

const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  balance: { type: Number, required: true },
  initialBalance: { type: Number, required: true },
  currency: { type: String, default: 'INR' }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
