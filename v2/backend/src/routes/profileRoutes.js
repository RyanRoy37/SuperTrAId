const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { createProfile, getProfile } = require('../controllers/profileController');

router.post('/', auth, createProfile);
router.get('/me', auth, getProfile);

module.exports = router;
