const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes protected
router.use(authMiddleware);

router.get('/', portfolioController.getPortfolio);
router.post('/buy', portfolioController.buyStock);
router.post('/sell', portfolioController.sellStock);

module.exports = router;
