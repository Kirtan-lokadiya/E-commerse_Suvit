const mongoose = require('mongoose');
const Token = require('./Token');

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
  photo: { type: String },
  deleted: { type: Boolean, default: false } // Soft delete flag
}, { timestamps: true });

// Index location field for geospatial queries
sellerSchema.index({ location: '2dsphere' });

// Middleware to soft delete associated products and hard delete token when seller is removed
sellerSchema.pre('remove', { document: true }, async function(next) {
  try {
    if (!this.deleted) {
      // Soft delete products associated with this seller
      await mongoose.models.Product.updateMany({ seller: this._id }, { $set: { deleted: true } });
      
      // Find and hard delete the token associated with this seller
      const token = await Token.findOne({ userId: this._id });
      if (token) {
        await token.remove();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Seller', sellerSchema);
