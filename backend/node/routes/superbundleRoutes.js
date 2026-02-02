const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createSuperbundle } = require("../controller/superbundleController");

router.post(
  "/superbundles",
  authMiddleware,
  createSuperbundle);

  router.put(
  "/superbundles/:id",
  authMiddleware,
  superbundleController.updateSuperbundle
);

router.delete(
  "/superbundles/:id",
  authMiddleware,
  superbundleController.deleteSuperbundle
);

router.post(
  "/superbundles/:id/buy",
  authMiddleware,
  superbundleController.buySuperbundle
);

router.get(
  "/superbundles",
  authMiddleware,
  superbundleController.getSuperbundles
);


router.get(
  "/superbundles/:id",
  authMiddleware,
  superbundleController.getSuperbundleById
);


module.exports = router;
