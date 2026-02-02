const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getSnapshots } = require('../controllers/snapshotController');

router.get('/', auth, getSnapshots);

module.exports = router;
