const cron = require('node-cron');
const pool = require('../config/postgres');
const UserProfile = require('../models/UserProfile');
const Portfolio = require('../models/Portfolio');
const PortfolioSnapshot = require('../models/PortfolioSnapshot');

module.exports = () => {
  // Every day at 23:55
  cron.schedule('55 23 * * *', async () => {
    console.log('[CRON] Portfolio snapshot started');

    try {
      const profiles = await UserProfile.find({});
      const today = new Date().toISOString().split('T')[0];

      for (const profile of profiles) {
        const userId = profile.userId;

        // Prevent duplicates
        const exists = await PortfolioSnapshot.findOne({ userId, date: today });
        if (exists) continue;

        const portfolio = await Portfolio.findOne({ userId });
        const holdings = portfolio?.holdings || [];

        let portfolioValue = 0;

        if (holdings.length > 0) {
          const stockIds = holdings.map(h => h.stockId);

          const prices = await pool.query(
            `
            SELECT DISTINCT ON (stock_id)
              stock_id, close
            FROM historical_prices
            WHERE stock_id = ANY($1)
            ORDER BY stock_id, date DESC
            `,
            [stockIds]
          );

          const priceMap = {};
          prices.rows.forEach(p => {
            priceMap[p.stock_id] = Number(p.close);
          });

          for (const h of holdings) {
            const price = priceMap[h.stockId] || 0;
            portfolioValue += h.quantity * price;
          }
        }

        const snapshot = new PortfolioSnapshot({
          userId,
          date: today,
          walletBalance: profile.wallet.balance,
          investedAmount: profile.wallet.invested,
          portfolioValue,
          unrealizedPnL: portfolioValue - profile.wallet.invested,
        });

        await snapshot.save();
      }

      console.log('[CRON] Portfolio snapshot completed');
    } catch (err) {
      console.error('[CRON] Portfolio snapshot failed', err);
    }
  });
};
