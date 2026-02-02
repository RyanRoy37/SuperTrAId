// backend/src/app.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env FIRST
dotenv.config();

// DB connections
const connectMongo = require('./config/mongo');
connectMongo();

// Routes
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const profileRoutes = require('./routes/profileRoutes');
const superbundleRoutes = require('./routes/superbundleRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const investmentGoalRoutes = require('./routes/investmentGoalRoutes');
const snapshotRoutes = require('./routes/snapshotRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Start cron jobs AFTER env + DB init
const startCrons = require('./cron');
startCrons();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/superbundles', superbundleRoutes);
app.use('/api/activity', activityLogRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/goals', investmentGoalRoutes);
app.use('/api/snapshots', snapshotRoutes);
app.use('/api/dashboard', dashboardRoutes);

module.exports = app;
