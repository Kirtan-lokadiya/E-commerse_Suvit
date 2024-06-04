const checkoutService = require('../services/checkoutService');

const handlePaymentSuccess = async (req, res) => {
  await checkoutService.handlePaymentSuccess(req, res);
};

module.exports = {
  handlePaymentSuccess
};
