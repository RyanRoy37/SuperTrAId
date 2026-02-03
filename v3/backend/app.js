const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const stockRoutes = require('./src/routes/stockRoutes');
const portfolioRoutes = require('./src/routes/portfolioRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const bundleRoutes = require('./src/routes/bundleRoutes');
const wishlistRoutes = require('./src/routes/wishlistRoutes');
const goalRoutes = require('./src/routes/goalRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/goals', goalRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;