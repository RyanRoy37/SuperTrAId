const { pgPool } = require('../config/db');

const createTables = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS stocks (
      id SERIAL PRIMARY KEY,
      symbol VARCHAR(50) NOT NULL,
      exchange VARCHAR(10) NOT NULL,
      company_name VARCHAR(255) NOT NULL,
      isin VARCHAR(50),
      sector VARCHAR(100),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS historical_prices (
      id SERIAL PRIMARY KEY,
      stock_id INTEGER REFERENCES stocks(id),
      date DATE NOT NULL,
      open DECIMAL(10,2),
      high DECIMAL(10,2),
      low DECIMAL(10,2),
      close DECIMAL(10,2),
      volume BIGINT,
      UNIQUE(stock_id, date)
    )`,
    `CREATE TABLE IF NOT EXISTS intraday_prices (
      id SERIAL PRIMARY KEY,
      stock_id INTEGER REFERENCES stocks(id),
      timestamp TIMESTAMP NOT NULL,
      open DECIMAL(10,2),
      high DECIMAL(10,2),
      low DECIMAL(10,2),
      close DECIMAL(10,2),
      volume BIGINT,
      UNIQUE(stock_id, timestamp)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol)`,
    `CREATE INDEX IF NOT EXISTS idx_historical_date ON historical_prices(date)`,
    `CREATE INDEX IF NOT EXISTS idx_historical_stock_date ON historical_prices(stock_id, date DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_intraday_timestamp ON intraday_prices(timestamp)`
  ];

  for (const query of queries) {
    await pgPool.query(query);
  }
  console.log('PostgreSQL tables created/verified');
};

module.exports = { createTables, pgPool };