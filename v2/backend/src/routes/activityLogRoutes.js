const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes protected
router.use(authMiddleware);

router.get('/', activityLogController.getLogs);

module.exports = router;
