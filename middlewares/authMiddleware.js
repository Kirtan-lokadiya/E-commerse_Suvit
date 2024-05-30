const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    next();
  } catch (ex) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
