const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');
const isAdmin = require('../middlewares/isAdmin')
const router = express.Router();

router.get('/trending/:categoryName', productController.getTrendingProductsByCategory);
router.get('/allProducts', authMiddleware , isAdmin, productController.getAllProductsforAdmin);


router.get('/cart', authMiddleware, productController.getCartItems);

router.post('/getproducts',
  body('coordinates').isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of two numbers'),
  body('coordinates.*').isNumeric().withMessage('Coordinates must be numbers'),
  validationMiddleware,
  authMiddleware,
  productController.getAllProducts
);

router.get('/category', authMiddleware, productController.getProductsByCategory);


router.get('/:productId', productController.getProductDetails);


router.post('/add-to-cart', authMiddleware, productController.addToCart);

router.delete('/delete-from-cart/:productId', authMiddleware, productController.deleteFromCart);


module.exports = router;