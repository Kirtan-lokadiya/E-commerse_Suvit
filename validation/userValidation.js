const Joi = require('joi');

const userValidationSchema = Joi.object({
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
  ordercount: Joi.number().optional(),
  googleId: Joi.string().allow(null, '').optional(),
  tokens: Joi.array().items(Joi.string()).optional(),
  role: Joi.string().valid('admin', 'customer').default('customer'),
  photo: Joi.string().allow(null, '').optional(),
}).unknown(true);

module.exports = userValidationSchema;
