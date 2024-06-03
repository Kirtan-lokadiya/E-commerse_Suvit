const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Define the route for checkout API
router.post('/checkout',authMiddleware, orderController.createOrder);

module.exports = router;
