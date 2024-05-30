const express = require('express');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/add',
  authMiddleware,
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('text').notEmpty().withMessage('Text is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  validationMiddleware,
  commentController.addComment
);

router.get('/:productId',
  commentController.getComments
);

router.delete('/:id',
  authMiddleware,
  commentController.deleteComment
);

module.exports = router;
