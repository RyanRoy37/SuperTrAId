const express = require('express');
const router = express.Router();

const { getPortfolioSummary, getPortfolioHoldings } = require('../controller/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/summary', authMiddleware, getPortfolioSummary);
router.get('/holdings', authMiddleware, getPortfolioHoldings);

module.exports = router;
