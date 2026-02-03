const cron = require('node-cron');
const { updateStockPrices, updatePortfolioPrices } = require('../services/priceUpdateService');
const { backfillHistoricalData } = require('../services/historicalDataService');
const { generateIntradayData } = require('../services/intradayService');

const startCronJobs = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Running hourly price update...');
    await updateStockPrices();
    await updatePortfolioPrices();
  });

  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily backfill...');
    await backfillHistoricalData();
  });

  cron.schedule('*/5 * * * *', async () => {
    console.log('Running intraday data generation...');
    await generateIntradayData();
  });

  console.log('Cron jobs started');
};

module.exports = { startCronJobs };