const express = require("express");
const router = express.Router();
const stocksController = require("../controller/stocksController");

// Public endpoint (no auth)
router.get("/", stocksController.fetchAllStocks);

module.exports = router;
