const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, wishlistController.getWishlist);
router.post('/add', authMiddleware, wishlistController.addProductToWishlist);
router.delete('/remove/:productId', authMiddleware, wishlistController.removeProductFromWishlist);

module.exports = router;
