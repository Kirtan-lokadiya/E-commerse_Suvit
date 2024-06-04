const Razorpay = require('razorpay');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const config = require('../config/config');
const mongoose = require('mongoose');


const razorpay = new Razorpay({
  key_id: config.razorpayKeyId,
  key_secret: config.razorpayKeySecret
});

const calculateTotalAmount = (cart) => {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0); 
};

const createPaymentLink = async (userId, cart) => {
  try {
    const totalAmount = calculateTotalAmount(cart);

    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const options = {
      amount: parseInt(totalAmount  * 100),
      currency: 'INR',
      description: 'Payment for your order',
      customer: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        contact: user.phone
      },
      callback_url: `http://192.168.20.173:5000/api/payment/success?user_id=${userId}`, 
      callback_method: 'get'
    };

    const paymentLink = await razorpay.paymentLink.create(options);
    return paymentLink.short_url;
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw error;
  }
};
const handlePaymentSuccess = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_payment_link_id, user_id } = req.query;

    // Fetch user and cart details
    const user = await User.findById(user_id).populate('cart.product');

    if (!user || !user.cart || user.cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or user not found' });
    }

    // Create order
    const order = new Order({
      user: user_id,
      products: user.cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount: calculateTotalAmount(user.cart),
      status: 'completed' // Set order status to 'completed'
    });
    await order.save();

    // Create transaction
    const transaction = new Transaction({
      razorpayOrderId: razorpay_payment_link_id,
      razorpayPaymentId: razorpay_payment_id,
      user: user_id,
      amount: order.totalAmount,
      status: 'paid',
      order: order._id // Store the order ID in the transaction
    });
    await transaction.save();

    // Update stock quantities
    for (const item of user.cart) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Clear user's cart
    user.cart = [];
    await user.save();

    // Redirect to payment success page with the payment link ID
    res.redirect(`http://localhost:3000/payment/success/${razorpay_payment_link_id}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  createPaymentLink,
  handlePaymentSuccess
};

