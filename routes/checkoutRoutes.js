const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const checkoutController = require('../controllers/checkoutController');
const paymentController = require('../controllers/paymentController'); // Create this if separate for payment handling
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/checkout', authMiddleware, checkoutController.checkout);
router.get('/payment/success', paymentController.handlePaymentSuccess);



router.get('/success/:razorpay_payment_link_id', async (req, res) => {
  try {
    const { razorpay_payment_link_id } = req.params;
    // Find transaction by payment link ID
    const transaction = await Transaction.findOne({ razorpayOrderId: razorpay_payment_link_id }).populate('order');
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Fetch product details from order
    const products = await Order.findById(transaction.order._id).populate('products.product');

    res.status(200).json({ transaction, products });
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/order', authMiddleware, checkoutController.getOrders);


module.exports = router;
