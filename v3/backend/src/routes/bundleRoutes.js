const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const superBundleController = require('../controllers/superBundleController');

router.post('/', authMiddleware, superBundleController.createBundle);
router.get('/', authMiddleware, superBundleController.getBundles);
router.post('/:bundleId/buy', authMiddleware, superBundleController.buyBundle);

module.exports = router;