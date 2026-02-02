const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/superbundleController');

// Public
router.get('/', controller.getAllBundles);
router.get('/:id', controller.getBundleById);

// Protected
router.post('/', auth, controller.createBundle);
router.post('/:id/buy', auth, controller.buyBundle);

module.exports = router;
