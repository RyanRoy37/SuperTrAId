const hourlyPriceUpdate = require('./hourlyPriceUpdate');
const backfillHistorical = require('./backfillHistorical');
const intradayUpdater = require('./intradayUpdater');
const portfolioSnapshotCron = require('./portfolioSnapshotCron');
module.exports = () => {
  hourlyPriceUpdate();
  backfillHistorical();
  intradayUpdater();
  portfolioSnapshotCron();
};
