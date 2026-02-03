const { pgPool } = require('../config/db');

const generateMockHistoricalData = (stockId, basePrice, days = 90) => {
  const data = [];
  let currentPrice = basePrice;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const open = currentPrice;
    const volatility = 0.03;
    const high = open * (1 + Math.random() * volatility);
    const low = open * (1 - Math.random() * volatility);
    const close = low + Math.random() * (high - low);
    const volume = Math.floor(100000 + Math.random() * 500000);

    data.push({
      stockId,
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    });

    currentPrice = close;
  }

  return data;
};

const backfillHistoricalData = async () => {
  try {
    console.log('Checking for stocks needing backfill...');
    
    const stocks = await pgPool.query('SELECT id FROM stocks LIMIT 50');

    for (const stock of stocks.rows) {
      const existing = await pgPool.query(
        'SELECT COUNT(*) FROM historical_prices WHERE stock_id = $1',
        [stock.id]
      );

      if (parseInt(existing.rows[0].count) === 0) {
        const latestPrice = await pgPool.query(
          'SELECT close FROM historical_prices WHERE stock_id = $1 ORDER BY date DESC LIMIT 1',
          [stock.id]
        );
        
        const basePrice = latestPrice.rows.length > 0 
          ? parseFloat(latestPrice.rows[0].close) 
          : (500 + Math.random() * 2000);
        
        const historicalData = generateMockHistoricalData(stock.id, basePrice);

        for (const data of historicalData) {
          await pgPool.query(
            `INSERT INTO historical_prices (stock_id, date, open, high, low, close, volume)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (stock_id, date) DO NOTHING`,
            [data.stockId, data.date, data.open, data.high, data.low, data.close, data.volume]
          );
        }

        console.log(`Backfilled data for stock ${stock.id}`);
      }
    }
    
    console.log('Backfill check complete');
  } catch (error) {
    console.error('Backfill error:', error);
  }
};

const backfillAllStocksNow = async () => {
  console.log('Starting backfill process...');
  await backfillHistoricalData();
  console.log('Backfill process complete');
};

module.exports = { backfillHistoricalData, backfillAllStocksNow };