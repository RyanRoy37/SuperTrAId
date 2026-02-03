// walletRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {walletController} = require("../controller/walletController");
router.get('/wallet', authMiddleware, walletController.getWallet);
router.put('/wallet', authMiddleware, walletController.updateWallet);
