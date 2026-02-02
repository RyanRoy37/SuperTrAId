const cron = require('node-cron');
const pool = require('../config/postgres');

// Mock backfill generator
const generateCandle = (date) => {
  const base = Math.random() * 100 + 100;
  return {
    date,
    open: base,
    high: base + 10,
    low: base - 10,
    close: base + (Math.random() - 0.5) * 5,
    volume: Math.floor(Math.random() * 800_000),
  };
};

module.exports = () => {
  // Runs once daily at 02:00
  cron.schedule('0 2 * * *', async () => {
    console.log('[CRON] Backfill historical data started');

    try {
      const stocks = await pool.query(`SELECT id FROM stocks`);

      for (const stock of stocks.rows) {
        const dates = await pool.query(
          `SELECT date FROM historical_prices
           WHERE stock_id = $1
           ORDER BY date`,
          [stock.id]
        );

        if (dates.rows.length < 2) continue;

        const existingDates = new Set(
          dates.rows.map(d => d.date.toISOString().split('T')[0])
        );

        const start = new Date(dates.rows[0].date);
        const end = new Date();

        for (
          let d = new Date(start);
          d <= end;
          d.setDate(d.getDate() + 1)
        ) {
          const day = d.toISOString().split('T')[0];
          if (existingDates.has(day)) continue;

          const candle = generateCandle(day);

          await pool.query(
            `INSERT INTO historical_prices
             (stock_id, date, open, high, low, close, volume)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              stock.id,
              candle.date,
              candle.open,
              candle.high,
              candle.low,
              candle.close,
              candle.volume,
            ]
          );
        }
      }

      console.log('[CRON] Backfill completed');
    } catch (err) {
      console.error('[CRON] Backfill failed', err);
    }
  });
};
