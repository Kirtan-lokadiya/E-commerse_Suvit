const mongoose = require('mongoose');
const userValidationSchema = require('../validation/userValidation');
const Token = require('./Token');

// Define a sub-schema for cart items
const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number,  min: 1 }
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: String }
  },
  phone: { type: String, required: true },
  ordercount: { type: Number, default: 0 },
  googleId: { type: String },
  tokens: [{ type: String }],
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  location: {
    type: { type: String },
    coordinates: { type: [Number], default: [0, 0], required: true }
  },
  cart: [cartItemSchema],
  photo: { type: String }
}, { timestamps: true });

// Index location field for geospatial queries
userSchema.index({ location: '2dsphere' });

// Middleware to validate data before saving
userSchema.pre('save', function (next) {
  const user = this;
  const validationResult = userValidationSchema.validate(user.toObject(), { abortEarly: false });
  if (validationResult.error) {
    const errorMessages = validationResult.error.details.map(detail => detail.message);
    // Remove errors related to unnecessary fields
    const filteredErrorMessages = errorMessages.filter(message => !['ordercount', '_id', 'createdAt', 'updatedAt', '__v'].includes(message.split('"')[1]));
    if (filteredErrorMessages.length > 0) {
      next(new Error(filteredErrorMessages.join(', ')));
    } else {
      next();
    }
  } else {
    next();
  }
});

userSchema.pre('remove', async function(next) {
  try {
    // Find and delete the token associated with this user
    const token = await Token.findOne({ userId: this._id });
    if (token) {
      await token.remove();
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
