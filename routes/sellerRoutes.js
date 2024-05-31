const express = require('express');
const { body } = require('express-validator');
const sellerController = require('../controllers/sellerController');
const validationMiddleware = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const sellerMiddleware = require('../middlewares/sellerMiddleware');
const productController = require('../controllers/productController');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin')

router.post('/signup',
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.country').notEmpty().withMessage('Country is required'),
  body('address.zip').notEmpty().withMessage('Zip code is required'),
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('businessRegistrationNumber').notEmpty().withMessage('Business registration number is required'),
  body('bankName').notEmpty().withMessage('Bank name is required'),
  body('accountNumber').notEmpty().withMessage('Account number is required'),
  validationMiddleware,
  sellerController.signup
);

router.post('/login',
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validationMiddleware,
  sellerController.login
);

router.put('/location',
  sellerMiddleware,
  validationMiddleware,
  sellerController.updatesellerLocation
);

router.get('/products', sellerMiddleware, productController.getSellerProducts);
router.delete('/delete/:id', authMiddleware,isAdmin, sellerController.deleteSeller);



module.exports = router;
