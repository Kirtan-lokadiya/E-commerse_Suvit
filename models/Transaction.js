const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
