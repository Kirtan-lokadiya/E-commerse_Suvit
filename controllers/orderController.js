const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user ID in req.user from authentication middleware
    const checkoutOptions = await orderService.createOrder(userId);
    res.json(checkoutOptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  createOrder
};
