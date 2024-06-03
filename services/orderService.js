const Razorpay = require('razorpay');
const User = require('../models/User');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const config = require('../config/config');

const razorpay = new Razorpay({
  key_id: config.razorpayKeyId,
  key_secret: config.razorpayKeySecret
});

const calculateTotalAmount = (cart) => {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0) * 100; 
};

const generateLineItems = (cart) => {
  return cart.map(item => ({
    item_id: item.product._id,
    item_name: item.product.name,
    amount: item.product.price ,
    quantity: item.quantity
  }));
};

const createOrder = async (userId) => {
  const user = await User.findById(userId).populate('cart.product');

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

  const razorpayOrder = await razorpay.orders.create(options);

  const transaction = new Transaction({
    razorpayOrderId: razorpayOrder.id,
    user: userId,
    amount: totalAmount,
    status: 'created'
  });

  await transaction.save();

  const order = new Order({
    user: userId,
    products: cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    })),
    totalAmount: totalAmount / 100, // Convert back to INR
    transaction: transaction._id
  });

  await order.save();

  const magicCheckoutOptions = {
    key: config.razorpayKeyId,
    order_id: razorpayOrder.id,
    name: 'Your Company Name',
    description: 'Payment for your order',
    image: 'https://example.com/your_logo.jpg',
    prefill: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      contact: user.phone
    },
    notes: {
      'shopping_order_id': razorpayOrder.receipt
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
