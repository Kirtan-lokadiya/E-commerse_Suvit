const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get Wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      match: { deleted: false }
    });
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Product to Wishlist
const addProductToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove Product from Wishlist
const removeProductFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWishlist,
  addProductToWishlist,
  removeProductFromWishlist
};
