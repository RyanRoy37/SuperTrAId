const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const portfolioController = require('../controllers/portfolioController');

router.get('/', authMiddleware, portfolioController.getPortfolio);

module.exports = router;