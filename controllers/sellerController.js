const sellerService = require('../services/sellerService');
const { validationResult } = require('express-validator');
const Sellers = require('../models/Seller');

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { seller, token } = await sellerService.signup(req.body);
    res.status(201).json({ message: 'Seller registered successfully', seller, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { seller, token } = await sellerService.login(req.body);
    res.status(200).json({ message: 'Login successful', seller, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const updatesellerLocation = async (req, res) => {
  try {
    const { coordinates } = req.body; // Extracting coordinates directly from the request body
    const userId = req.user.id;

    const user = await Sellers.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    user.location = {
      type: 'Point',
      coordinates
    };

    await user.save();
    res.json({ message: 'Location updated successfully', coordinates });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
const getAllSellers = async (req, res) => {
  try {
    // Query all sellers from the database and select only required fields
    const sellers = await Sellers.find({}, 'firstName lastName email');

    // Populate each seller's products
    await Sellers.populate(sellers, { path: 'products', model: 'Product' });

    const totalSellersCount = await Sellers.countDocuments();

    res.json({ sellers, totalSellersCount });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteSeller = async (req, res) => {
  try {
    const sellerId = req.params.id;
    // Find the seller by ID and delete it
    await Sellers.findByIdAndDelete(sellerId);
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ error: 'Error deleting seller' });
  }
};

module.exports = { signup, login, updatesellerLocation,getAllSellers,deleteSeller };
