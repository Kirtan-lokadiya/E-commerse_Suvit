const Product = require('../models/Product');
const Seller = require('../models/Seller');

const getAllProducts = async () => {
  return await Product.find().populate('seller');
};

const getProductsByCustomerLocation = async (coordinates) => {
  // Step 1: Find sellers near the customer's location
  const sellers = await Seller.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: 10000 // Adjust the distance as needed (in meters)
      }
    }
  }).select('_id');

  const sellerIds = sellers.map(seller => seller._id);

  // Step 2: Find products from these sellers
  const products = await Product.find({ seller: { $in: sellerIds } }).populate('seller');

  return products;
};

const createProduct = async ({ name, description, price, stock, category, subcategory, imageUrls, seller }) => {
  const newProduct = new Product({
    name,
    description,
    price,
    stock,
    category,
    subcategory,
    imageUrls,
    seller
  });
  return await newProduct.save();
};


const getSellerProducts = async (sellerId) => {
  return await Product.find({ seller: sellerId });
};

module.exports = { getAllProducts, getProductsByCustomerLocation, createProduct, getSellerProducts };
