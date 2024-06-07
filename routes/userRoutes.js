const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');

const router = express.Router();

router.put('/profile-update',
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  validationMiddleware,
  authMiddleware,
  userController.updateUserProfile
);

router.put('/update-location',
  body('coordinates').isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of two numbers'),
  body('coordinates.*').isNumeric().withMessage('Coordinates must be numbers'),
  validationMiddleware,
  authMiddleware,
  userController.updateUserLocation
);


router.get('/details',authMiddleware, userController.getUserDetails);
router.get('/search',authMiddleware, userController.searchUsers);



module.exports = router;
