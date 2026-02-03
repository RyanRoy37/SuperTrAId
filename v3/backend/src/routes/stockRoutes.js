const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const stockController = require('../controllers/stockController');

router.get('/', authMiddleware, stockController.getStocks);
router.get('/:id', authMiddleware, stockController.getStockDetails);

module.exports = router;