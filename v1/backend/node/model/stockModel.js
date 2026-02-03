const db = require("../db");

let cache = {
  data: null,
  etag: null,
  lastUpdated: null
};

const getAllStocks = async () => {
  if (cache.data) {
    return cache;
  }

  const result = await db.query(`
    SELECT 
      id,
      symbol,
      exchange,
      company_name,
      isin,
      face_value,
      status,
      "group",
      instrument,
      listing_date,
      market_lot,
      paid_up_value,
      security_code
    FROM stocks
    WHERE status = 'ACTIVE'
    ORDER BY symbol
  `);

  const etag = `"stocks-${result.rowCount}-${Date.now()}"`;

  cache = {
    data: result.rows,
    etag,
    lastUpdated: new Date()
  };

  return cache;
};

module.exports = {
  getAllStocks
};
