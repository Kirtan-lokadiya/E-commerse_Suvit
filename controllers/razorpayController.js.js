const Razorpay = require('razorpay');
const config = require('../config/config');

const razorpay = new Razorpay({
  key_id: config.razorpayKeyId,
  key_secret: config.razorpayKeySecret,
  // Other Razorpay options...
});

const createPayment = async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    const options = {
      amount: amount, // amount in smallest currency unit (e.g., 1000 = ₹10)
      currency: currency,
      receipt: receipt,
      notes: notes
      // Add other options as needed
    };

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(options);

    // Send Razorpay order response to the client
    res.status(200).json(razorpayOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Other controller functions...

module.exports = { createPayment };
