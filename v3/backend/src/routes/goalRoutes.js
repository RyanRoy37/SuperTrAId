const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const goalController = require('../controllers/goalController');

router.post('/', authMiddleware, goalController.createGoal);
router.get('/', authMiddleware, goalController.getGoals);
router.put('/:id', authMiddleware, goalController.updateGoal);

module.exports = router;