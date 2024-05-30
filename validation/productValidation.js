const { check, validationResult } = require('express-validator');

const validateProduct = [
  check('name').notEmpty().withMessage('Name is required'),
  check('description').notEmpty().withMessage('Description is required'),
  check('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
  check('stock').isInt({ gt: 0 }).withMessage('Stock must be a positive integer'),
  check('category').notEmpty().withMessage('Category is required'),
  check('seller').notEmpty().withMessage('Seller is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateProduct };
