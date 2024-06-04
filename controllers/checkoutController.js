const Order = require('../models/Order');
const checkoutService = require('../services/checkoutService');
const User = require('../models/User')

const checkout = async (req, res) => {
  try {
    const userId = req.user._id; // Ensure user authentication middleware is used to populate req.user
    const user = await User.findById(userId).populate('cart.product');
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or user not found' });
    }

    const paymentLink = await checkoutService.createPaymentLink(userId, user.cart);
    res.json({ paymentLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


const getOrders = async (req, res) => {
  try {
    const userId = req.user._id; 

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('products.product'); // This is the key part

    res.json({ orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  checkout,getOrders
};
