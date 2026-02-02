const cron = require('node-cron');
const pool = require('../config/postgres');

// MOCK price fetcher (replace later)
const fetchDailyPrice = async (stock) => {
  const base = Math.random() * 100 + 100;
  return {
    open: base,
    high: base + Math.random() * 10,
    low: base - Math.random() * 10,
    close: base + (Math.random() - 0.5) * 5,
    volume: Math.floor(Math.random() * 1_000_000),
  };
};

module.exports = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Hourly price update started');

    try {
      const stocks = await pool.query(
        `SELECT id FROM stocks WHERE status = 'ACTIVE'`
      );

      const today = new Date().toISOString().split('T')[0];

      for (const stock of stocks.rows) {
        const exists = await pool.query(
          `SELECT 1 FROM historical_prices
           WHERE stock_id = $1 AND date = $2`,
          [stock.id, today]
        );

        if (exists.rows.length > 0) continue;

        const price = await fetchDailyPrice(stock);

        await pool.query(
          `INSERT INTO historical_prices
           (stock_id, date, open, high, low, close, volume)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            stock.id,
            today,
            price.open,
            price.high,
            price.low,
            price.close,
            price.volume,
          ]
        );
      }

      console.log('[CRON] Hourly price update completed');
    } catch (err) {
      console.error('[CRON] Hourly price update failed', err);
    }
  });
};
