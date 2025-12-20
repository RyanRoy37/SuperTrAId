const express = require('express');
const router = express.Router();

const { getPortfolioSummary } = require('../controller/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/summary', authMiddleware, getPortfolioSummary);

module.exports = router;
