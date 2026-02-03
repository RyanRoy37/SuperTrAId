const { pgPool } = require('../config/db');
const { paginate, paginateResponse } = require('../utils/pagination');

exports.getStocks = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    let query = `
      SELECT 
        s.*,
        (
          SELECT close 
          FROM historical_prices 
          WHERE stock_id = s.id 
          ORDER BY date DESC 
          LIMIT 1
        ) as latest_price
      FROM stocks s
      WHERE EXISTS (
        SELECT 1 FROM historical_prices WHERE stock_id = s.id
      )
    `;
    let countQuery = `
      SELECT COUNT(*) 
      FROM stocks s
      WHERE EXISTS (
        SELECT 1 FROM historical_prices WHERE stock_id = s.id
      )
    `;
    const params = [];

    if (search) {
      query += ' AND (s.symbol ILIKE $1 OR s.company_name ILIKE $1)';
      countQuery += ' AND (s.symbol ILIKE $1 OR s.company_name ILIKE $1)';
      params.push(`%${search}%`);
    }

    const countResult = await pgPool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY s.symbol LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limitNum, skip);

    const result = await pgPool.query(query, params);

    res.json(paginateResponse(result.rows, total, page, limit));
  } catch (error) {
    console.error('Stock fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
};

exports.getStockDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const stockResult = await pgPool.query(`
      SELECT 
        s.*,
        (
          SELECT close 
          FROM historical_prices 
          WHERE stock_id = s.id 
          ORDER BY date DESC 
          LIMIT 1
        ) as latest_price
      FROM stocks s
      WHERE s.id = $1
    `, [id]);
    
    if (stockResult.rows.length === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const stock = stockResult.rows[0];

    const pricesResult = await pgPool.query(
      'SELECT * FROM historical_prices WHERE stock_id = $1 ORDER BY date DESC LIMIT 90',
      [id]
    );

    res.json({
      stock,
      historicalPrices: pricesResult.rows.reverse()
    });
  } catch (error) {
    console.error('Stock details error:', error);
    res.status(500).json({ error: 'Failed to fetch stock details' });
  }
};