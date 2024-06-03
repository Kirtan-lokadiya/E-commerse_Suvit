const Razorpay = require('razorpay');
const User = require('../models/User');
const config = require('../config/config');


const razorpay = new Razorpay({
    key_id: config.razorpayKeyId,
    key_secret: config.razorpayKeySecret
  });
const calculateTotalAmount = (cart) => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0) * 100; 
};

const generateLineItems = (cart) => {
  return cart.map(item => ({
    item_id: item._id,
    item_name: item.name,
    amount: item.price * 100, // Convert to paise
    quantity: item.quantity
  }));
};

const createOrder = async (userId) => {
  const user = await User.findById(userId).populate('cart');

  if (!user || !user.cart || user.cart.length === 0) {
    throw new Error('Cart is empty');
  }

  const cart = user.cart;
  const totalAmount = calculateTotalAmount(cart);

  const options = {
    amount: totalAmount,
    currency: 'INR',
    receipt: `order_${Date.now()}`,
    payment_capture: 1
  };

  const response = await razorpay.orders.create(options);

  const magicCheckoutOptions = {
    key: 'rzp_test_QcTBERZ8hbCIx4',
    order_id: response.id,
    name: 'Your Company Name',
    description: 'Payment for your order',
    image: 'https://example.com/your_logo.jpg',
    prefill: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      contact: user.phone
    },
    notes: {
      'shopping_order_id': response.receipt
    },
    theme: {
      color: '#3399cc'
    },
    line_items: generateLineItems(cart)
  };

  return magicCheckoutOptions;
};

module.exports = {
  createOrder
};
