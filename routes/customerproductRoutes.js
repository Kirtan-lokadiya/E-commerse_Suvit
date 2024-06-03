const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, query } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');
const isAdmin = require('../middlewares/isAdmin')
const router = express.Router();


router.post('/getproducts',
  body('coordinates').isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of two numbers'),
  body('coordinates.*').isNumeric().withMessage('Coordinates must be numbers'),
  query('minPrice').optional().isNumeric().withMessage('minPrice must be a number'),
  query('maxPrice').optional().isNumeric().withMessage('maxPrice must be a number'),
  query('subcategoryId').optional().isMongoId().withMessage('subcategoryId must be a valid MongoID'),
  query('sortBy').optional().isString().withMessage('sortBy must be a string'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be "asc" or "desc"'),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('limit must be a positive integer'),
  validationMiddleware,
  authMiddleware,
  productController.getAllProducts
);
router.get('/trending', productController.getTrendingProductsByCategory);
router.get('/allProducts', authMiddleware , isAdmin, productController.getAllProductsforAdmin);

router.get('/cart', authMiddleware, productController.getCartItems);

router.get('/:productId', productController.getProductDetails);


router.post('/add-to-cart', authMiddleware, productController.addToCart);

router.delete('/delete-from-cart/:productId', authMiddleware, productController.deleteFromCart);


module.exports = router;