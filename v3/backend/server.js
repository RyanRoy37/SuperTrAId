require('dotenv').config();
const app = require('./app');
const { connectMongoDB } = require('./src/config/db');
const { createTables } = require('./src/models/postgres');
const { startCronJobs } = require('./src/cron/jobs');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectMongoDB();
  await createTables();
  
  console.log('Skipping backfill - using existing historical data');
  
  startCronJobs();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();