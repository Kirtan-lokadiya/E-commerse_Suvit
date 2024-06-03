const checkoutService = require('../services/checkoutService');

const checkout = async (req, res) => {
  try {
    const userId = req.user._id; // Ensure user authentication middleware is used to populate req.user
    const magicCheckoutOptions = await checkoutService.createOrder(userId);
    res.json(magicCheckoutOptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  checkout
};
