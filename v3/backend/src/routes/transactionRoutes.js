const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const transactionController = require('../controllers/transactionController');

router.post('/buy', authMiddleware, transactionController.buyStock);
router.post('/sell', authMiddleware, transactionController.sellStock);
router.get('/', authMiddleware, transactionController.getTransactions);

module.exports = router;