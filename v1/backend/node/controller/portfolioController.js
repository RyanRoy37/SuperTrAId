const pool = require('../db');

const getPortfolioSummary = async (req, res) => {
  try {
    const userId = req.user_id; 

    const query = `
      SELECT
        COALESCE(SUM(h.quantity * h.avg_price), 0) AS total_invested,
        COALESCE(SUM(h.quantity * hp.close), 0) AS current_value
      FROM holdings h
      JOIN LATERAL (
        SELECT close
        FROM historical_prices
        WHERE stock_id = h.stock_id
        ORDER BY date DESC
        LIMIT 1
      ) hp ON true
      WHERE h.user_id = $1;
    `;

    const { rows } = await pool.query(query, [userId]);

    const totalInvested = Number(rows[0].total_invested);
    const currentValue = Number(rows[0].current_value);

    res.json({
      total_invested: totalInvested,
      current_value: currentValue,
      total_pnl: currentValue - totalInvested,
      day_pnl: 0,        
      cash_balance: 0    
    });

  } catch (err) {
    console.error('Portfolio summary error:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio summary' });
  }
};
const getPortfolioHoldings = async (req, res) => {
  try {
    const userId = req.user_id; 

    const query = `
      SELECT
        h.stock_id,
        s.symbol,
        h.quantity,
        h.avg_price,
        hp.close AS current_price,
        (hp.close - h.avg_price) * h.quantity AS pnl
      FROM holdings h
      JOIN stocks s
        ON s.id = h.stock_id
      JOIN LATERAL (
        SELECT close
        FROM historical_prices
        WHERE stock_id = h.stock_id
        ORDER BY date DESC
        LIMIT 1
      ) hp ON true
      WHERE h.user_id = $1
      ORDER BY s.symbol;
    `;

    const { rows } = await pool.query(query, [userId]);

    res.json(rows);

  } catch (err) {
    console.error('Portfolio holdings error:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio holdings' });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user_id; 

    const query = `
      SELECT
        w.stock_id,
        s.symbol
      FROM wishlist w
      JOIN stocks s
        ON s.id = w.stock_id
      WHERE w.user_id = $1
      ORDER BY s.symbol;
    `;

    const { rows } = await pool.query(query, [userId]);

    res.json(rows);

  } catch (err) {
    console.error('Wishlist error:', err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user_id;

    const {
      limit = 20,
      offset = 0,
      type,
      from_date,
      to_date
    } = req.query;

    const values = [userId];
    let whereClause = '';
    let idx = 2;

    if (type) {
      whereClause += ` AND a.type = $${idx++}`;
      values.push(type);
    }

    if (from_date) {
      whereClause += ` AND a.created_at >= $${idx++}`;
      values.push(from_date);
    }

    if (to_date) {
      whereClause += ` AND a.created_at <= $${idx++}`;
      values.push(to_date);
    }

    // ---- total count ----
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM activity_log a
      WHERE a.user_id = $1
      ${whereClause};
    `;

    const countResult = await pool.query(countQuery, values);
    const total = Number(countResult.rows[0].total);

    // ---- paginated data ----
    values.push(limit, offset);

    const dataQuery = `
      SELECT
        a.id,
        a.type,
        a.stock_id,
        s.symbol,
        a.bundle_id,
        a.quantity,
        a.price,
        a.message,
        a.created_at
      FROM activity_log a
      LEFT JOIN stocks s
        ON s.id = a.stock_id
      WHERE a.user_id = $1
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT $${idx++} OFFSET $${idx};
    `;

    const { rows } = await pool.query(dataQuery, values);

    res.json({ total, transactions: rows });

  } catch (err) {
    console.error('Transactions error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

const getAlerts = async (req, res) => {
  try {
    const userId = req.user_id;

    const query = `
      SELECT
        a.id,
        a.type,
        a.stock_id,
        s.symbol,
        a.bundle_id,
        a.message,
        a.created_at
      FROM activity_log a
      LEFT JOIN stocks s
        ON s.id = a.stock_id
      WHERE a.user_id = $1
        AND a.type = 'alert'
      ORDER BY a.created_at DESC;
    `;

    const { rows } = await pool.query(query, [userId]);

    res.json(rows);

  } catch (err) {
    console.error('Alerts error:', err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};


module.exports = { getPortfolioSummary,
    getPortfolioHoldings,getWishlist,
    getTransactions, getAlerts
 };
