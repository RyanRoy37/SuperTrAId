const express = require("express");
const router = express.Router();
const historyController = require("../controller/historyController");

// Initial load (latest 200)
router.get(
  "/stocks/:id/history/daily",
  historyController.getLatestDailyHistory
);

// Older candles (pagination)
router.get(
  "/stocks/:id/history/daily/paginated",
  historyController.getPaginatedDailyHistory
);

module.exports = router;
