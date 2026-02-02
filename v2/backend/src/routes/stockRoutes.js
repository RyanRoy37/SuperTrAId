// backend/src/routes/stockRoutes.js

const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// Public stock routes (read-only)

// Get historical prices FIRST
router.get('/:id/history', stockController.getHistoricalPrices);

// Get stock by id
router.get('/:id', stockController.getStockById);

// ✅ Get all stocks WITH pagination
// /api/stocks?page=1&limit=50
router.get('/', stockController.getAllStocks);

module.exports = router;
