const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const authMiddleware = require('../middlewares/authMiddleware'); 

router.post('/checkout', authMiddleware,  checkoutController.checkout);

module.exports = router;
