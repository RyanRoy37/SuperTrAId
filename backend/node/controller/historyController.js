const historyModel = require("../model/historyModel");

const getLatestDailyHistory = async (req, res) => {
  try {
    const stockId = parseInt(req.params.id, 10);

    if (isNaN(stockId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid stock id"
      });
    }

    // Step 1: Fetch latest 200 (DESC)
    const rows = await historyModel.fetchLatestDailyCandles(stockId);

    // Step 2: Ensure enough data
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No historical data found"
      });
    }

    // Step 3: Reverse → ASC (oldest → newest)
    const candles = rows.reverse();

    // Step 4: Final response
    return res.status(200).json({
      success: true,
      stock_id: stockId,
      interval: "1d",
      count: candles.length,
      candles
    });
  } catch (err) {
    console.error("Daily history fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch historical candles"
    });
  }
};


const historyModel = require("../model/historyModel");

const getPaginatedDailyHistory = async (req, res) => {
  try {
    const stockId = parseInt(req.params.id, 10);
    const limit = Math.min(parseInt(req.query.limit) || 200, 500);
    const offset = parseInt(req.query.offset) || 0;

    if (isNaN(stockId) || offset < 0 || limit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters"
      });
    }

    // Fetch paginated candles (DESC)
    const rows = await historyModel.fetchDailyCandlesPaginated(
      stockId,
      limit,
      offset
    );

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        stock_id: stockId,
        interval: "1d",
        count: 0,
        candles: []
      });
    }

    // Reverse → ASC
    const candles = rows.reverse();

    return res.status(200).json({
      success: true,
      stock_id: stockId,
      interval: "1d",
      limit,
      offset,
      count: candles.length,
      candles
    });
  } catch (err) {
    console.error("Paginated history fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch paginated candles"
    });
  }
};

module.exports = {
  getLatestDailyHistory,
  getPaginatedDailyHistory
};

