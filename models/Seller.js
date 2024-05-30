const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: String }
  },
  role: { type: String, enum: ['seller'], default: 'seller' },
  companyName: { type: String, required: true },
  businessRegistrationNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  photo: { type: String }
}, { timestamps: true });

// Index location field for geospatial queries
sellerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Seller', sellerSchema);
