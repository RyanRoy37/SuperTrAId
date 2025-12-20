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



module.exports = { getPortfolioSummary,
    getPortfolioHoldings
 };
