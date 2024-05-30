const express = require('express');
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/signup',
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  validationMiddleware,
  authController.signup
);

router.post('/login',
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).notEmpty().withMessage('Password is required'),
  validationMiddleware,
  authController.login
);

module.exports = router;
