const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Seller = require('../models/Seller');

const sellerMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await Seller.findById(decoded.sellerId);
    if (!req.user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    next();
  } catch (ex) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = sellerMiddleware;
