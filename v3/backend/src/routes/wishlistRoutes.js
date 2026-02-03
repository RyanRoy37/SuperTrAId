const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const wishlistController = require('../controllers/wishlistController');

router.post('/', authMiddleware, wishlistController.addToWishlist);
router.get('/', authMiddleware, wishlistController.getWishlist);
router.delete('/:stockId', authMiddleware, wishlistController.removeFromWishlist);

module.exports = router;