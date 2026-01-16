const stocksModel = require("../model/stocksModel");

const fetchAllStocks = async (req, res) => {
  try {
    const { data, etag } = await stocksModel.getAllStocks();

    // Client-side caching support
    if (req.headers["if-none-match"] === etag) {
      return res.status(304).end();
    }

    res.setHeader("ETag", etag);
    res.setHeader("Cache-Control", "public, max-age=3600");

    return res.status(200).json({
      success: true,
      count: data.length,
      stocks: data
    });
  } catch (err) {
    console.error("Fetch stocks error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stocks"
    });
  }
};

module.exports = {
  fetchAllStocks
};
