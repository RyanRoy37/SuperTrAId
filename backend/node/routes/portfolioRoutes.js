const express = require('express');
const router = express.Router();

const { getPortfolioSummary, getPortfolioHoldings, getWishlist, getTransactions, getAlerts } = require('../controller/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/summary', authMiddleware, getPortfolioSummary);
router.get('/holdings', authMiddleware, getPortfolioHoldings);
router.get('/wishlist', authMiddleware, getWishlist);
router.get('/transactions', authMiddleware, getTransactions);
router.get('/alerts', authMiddleware, getAlerts);



module.exports = router;
