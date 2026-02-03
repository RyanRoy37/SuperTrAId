const db = require("../db");

const fetchLatestDailyCandles = async (stockId) => {
  const result = await db.query(
    `
    SELECT
      date,
      open,
      high,
      low,
      close,
      volume
    FROM historical_prices
    WHERE stock_id = $1
    ORDER BY date DESC
    LIMIT 200
    `,
    [stockId]
  );

  return result.rows; // DESC order
};


const db = require("../db");

const fetchDailyCandlesPaginated = async (stockId, limit, offset) => {
  const result = await db.query(
    `
    SELECT
      date,
      open,
      high,
      low,
      close,
      volume
    FROM historical_prices
    WHERE stock_id = $1
    ORDER BY date DESC
    LIMIT $2 OFFSET $3
    `,
    [stockId, limit, offset]
  );

  return result.rows; // DESC
};

module.exports = {
  fetchLatestDailyCandles,
  fetchDailyCandlesPaginated
};

