const express = require('express');
const productController = require('../controllers/productController');
const sellerMiddleware = require('../middlewares/sellerMiddleware');
const { body } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/createproduct',sellerMiddleware, 
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Product description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('stock').isInt().withMessage('Stock must be an integer'),
  body('category').notEmpty().withMessage('Category is required'),
  validationMiddleware,
  productController.createProduct
);

router.put('/updateproduct/:productId',
  sellerMiddleware,
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Product description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('stock').isInt().withMessage('Stock must be an integer'),
  body('category').notEmpty().withMessage('Category is required'),
  validationMiddleware,
  productController.updateProduct
);

router.delete('/deleteproduct/:id',
sellerMiddleware,
  productController.deleteProduct
);

module.exports = router;
