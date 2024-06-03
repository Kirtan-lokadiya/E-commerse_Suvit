const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

// Define the route for checkout API
router.post('/checkout', orderController.createOrder);

module.exports = router;
