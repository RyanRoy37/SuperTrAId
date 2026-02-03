require('dotenv').config();
const { pgPool } = require('../src/config/db');

const mockStocks = [
  { symbol: 'RELIANCE', exchange: 'NSE', company_name: 'Reliance Industries Ltd', isin: 'INE002A01018', sector: 'Energy', latest_price: 2450.50 },
  { symbol: 'TCS', exchange: 'NSE', company_name: 'Tata Consultancy Services Ltd', isin: 'INE467B01029', sector: 'IT', latest_price: 3650.75 },
  { symbol: 'HDFCBANK', exchange: 'NSE', company_name: 'HDFC Bank Ltd', isin: 'INE040A01034', sector: 'Banking', latest_price: 1580.25 },
  { symbol: 'INFY', exchange: 'NSE', company_name: 'Infosys Ltd', isin: 'INE009A01021', sector: 'IT', latest_price: 1450.00 },
  { symbol: 'ICICIBANK', exchange: 'NSE', company_name: 'ICICI Bank Ltd', isin: 'INE090A01021', sector: 'Banking', latest_price: 950.50 },
  { symbol: 'HINDUNILVR', exchange: 'NSE', company_name: 'Hindustan Unilever Ltd', isin: 'INE030A01027', sector: 'FMCG', latest_price: 2350.00 },
  { symbol: 'ITC', exchange: 'NSE', company_name: 'ITC Ltd', isin: 'INE154A01025', sector: 'FMCG', latest_price: 420.75 },
  { symbol: 'SBIN', exchange: 'NSE', company_name: 'State Bank of India', isin: 'INE062A01020', sector: 'Banking', latest_price: 580.25 },
  { symbol: 'BHARTIARTL', exchange: 'NSE', company_name: 'Bharti Airtel Ltd', isin: 'INE397D01024', sector: 'Telecom', latest_price: 850.50 },
  { symbol: 'KOTAKBANK', exchange: 'NSE', company_name: 'Kotak Mahindra Bank Ltd', isin: 'INE237A01028', sector: 'Banking', latest_price: 1750.00 }
];

const seedStocks = async () => {
  try {
    for (const stock of mockStocks) {
      await pgPool.query(
        `INSERT INTO stocks (symbol, exchange, company_name, isin, sector, latest_price)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [stock.symbol, stock.exchange, stock.company_name, stock.isin, stock.sector, stock.latest_price]
      );
    }
    console.log('Stocks seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedStocks();