const Joi = require('joi');

const sellerValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  address: Joi.object({
    street: Joi.string().allow(null, ''),
    city: Joi.string().allow(null, ''),
    state: Joi.string().allow(null, ''),
    country: Joi.string().allow(null, ''),
    zip: Joi.string().allow(null, '')
  }).optional(),
  phone: Joi.string().required(),
  businessName: Joi.string().required(),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).default([0, 0]).required()
  }).optional(),
  role: Joi.string().valid('admin', 'seller').default('seller'),
  photo: Joi.string().allow(null, '').optional(),
}).unknown(true);

module.exports = sellerValidationSchema;
