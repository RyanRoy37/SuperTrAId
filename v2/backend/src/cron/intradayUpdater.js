const cron = require('node-cron');
const pool = require('../config/postgres');

const generateIntraday = () => {
  const base = Math.random() * 100 + 100;
  return {
    open: base,
    high: base + Math.random() * 2,
    low: base - Math.random() * 2,
    close: base + (Math.random() - 0.5),
    volume: Math.floor(Math.random() * 50_000),
  };
};

module.exports = () => {
  cron.schedule('*/5 * * * *', async () => {
    console.log('[CRON] Intraday update');

    try {
      const stocks = await pool.query(`SELECT id FROM stocks`);

      for (const stock of stocks.rows) {
        const candle = generateIntraday();

        await pool.query(
          `INSERT INTO intraday_prices
           (stock_id, timestamp, open, high, low, close, volume)
           VALUES ($1, NOW(), $2, $3, $4, $5, $6)`,
          [
            stock.id,
            candle.open,
            candle.high,
            candle.low,
            candle.close,
            candle.volume,
          ]
        );
      }
    } catch (err) {
      console.error('[CRON] Intraday failed', err);
    }
  });
};
