const express = require('express');
const router = express.Router();
const investmentGoalController = require('../controllers/investmentGoalController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes protected
router.use(authMiddleware);

router.get('/', investmentGoalController.getGoals);
router.post('/', investmentGoalController.addGoal);

module.exports = router;
