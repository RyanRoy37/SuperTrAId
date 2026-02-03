const { pgPool } = require('../config/db');
const Portfolio = require('../models/Portfolio');

const generateMockPrice = (basePrice, volatility = 0.02) => {
  const change = basePrice * volatility * (Math.random() - 0.5) * 2;
  return Math.max(1, parseFloat((basePrice + change).toFixed(2)));
};

const updateStockPrices = async () => {
  try {
    const result = await pgPool.query(`
      SELECT DISTINCT ON (stock_id) stock_id, close
      FROM historical_prices
      ORDER BY stock_id, date DESC
    `);
    
    for (const stock of result.rows) {
      const newPrice = generateMockPrice(parseFloat(stock.close));
      const today = new Date().toISOString().split('T')[0];
      
      await pgPool.query(
        `INSERT INTO historical_prices (stock_id, date, open, high, low, close, volume)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (stock_id, date) DO UPDATE 
         SET close = $6, 
             high = GREATEST(historical_prices.high, $4), 
             low = LEAST(historical_prices.low, $5),
             volume = historical_prices.volume + $7`,
        [
          stock.stock_id, 
          today, 
          newPrice, 
          newPrice * 1.01, 
          newPrice * 0.99, 
          newPrice, 
          Math.floor(100000 + Math.random() * 100000)
        ]
      );
    }

    console.log(`Updated prices for ${result.rows.length} stocks`);
  } catch (error) {
    console.error('Price update error:', error);
  }
};

const updatePortfolioPrices = async () => {
  try {
    const stocks = await pgPool.query(`
      SELECT DISTINCT ON (stock_id) stock_id, close
      FROM historical_prices
      ORDER BY stock_id, date DESC
    `);
    
    const priceMap = {};
    stocks.rows.forEach(s => {
      priceMap[s.stock_id] = parseFloat(s.close);
    });

    const portfolios = await Portfolio.find({});

    for (const p of portfolios) {
      if (priceMap[p.stockId]) {
        p.currentPrice = priceMap[p.stockId];
        p.currentValue = p.quantity * p.currentPrice;
        p.unrealizedPL = p.currentValue - p.totalInvested;
        await p.save();
      }
    }

    console.log(`Updated ${portfolios.length} portfolio entries`);
  } catch (error) {
    console.error('Portfolio update error:', error);
  }
};

module.exports = { updateStockPrices, updatePortfolioPrices };