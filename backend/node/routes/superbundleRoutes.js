const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createSuperbundle } = require("../controller/superbundleController");

router.post(
  "/superbundles",
  authMiddleware,
  createSuperbundle);

module.exports = router;
