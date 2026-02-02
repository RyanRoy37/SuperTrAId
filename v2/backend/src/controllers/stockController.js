// backend/src/controllers/stockController.js

const pool = require('../config/postgres');

/**
 * GET /api/stocks?page=1&limit=50
 * Paginated stock list
 */
// backend/src/controllers/stockController.js

exports.getAllStocks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.id,
        s.symbol,
        s.exchange,
        s.company_name,
        (
          SELECT hp.close
          FROM historical_prices hp
          WHERE hp.stock_id = s.id
          ORDER BY hp.date DESC
          LIMIT 1
        ) AS latest_price
      FROM stocks s
      WHERE s.status = 'ACTIVE'
      ORDER BY s.symbol
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Get stocks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



/**
 * GET /api/stocks/:id
 */
exports.getStockById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT *
       FROM stocks
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get stock error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/stocks/:id/history
 */
exports.getHistoricalPrices = async (req, res) => {
  const { id } = req.params;
  const limit = Number(req.query.limit) || 365;

  try {
    const result = await pool.query(
      `SELECT date, open, high, low, close, volume
       FROM historical_prices
       WHERE stock_id = $1
       ORDER BY date ASC
       LIMIT $2`,
      [id, limit]
    );

    res.json(
      result.rows.map(r => ({
        x: r.date,
        c: Number(r.close),
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};