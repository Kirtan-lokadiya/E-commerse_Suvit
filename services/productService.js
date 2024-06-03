const Product = require('../models/Product');
const Seller = require('../models/Seller');

const getAllProducts = async () => {
  return await Product.find().populate('seller');
};

const getProductsByCustomerLocation = async (coordinates, filters) => {
  const { minPrice, maxPrice, categoryId, subcategoryId, sortBy, sortOrder, page, limit } = filters;

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

  // Step 2: Build the query for products
  const productQuery = {
    seller: { $in: sellerIds },
    price: { $gte: minPrice, $lte: maxPrice }
  };

  if (categoryId) {
    productQuery.category = categoryId; // Add category filter
  }

  if (subcategoryId) {
    productQuery.subcategory = subcategoryId;
  }

  // Step 3: Determine sorting order
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  // Step 4: Pagination
  const products = await Product.find(productQuery)
    .populate('category')
    .populate({
      path: 'seller',
      select: 'firstName lastName companyName' // Only select these fields
    })
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit);

  // Step 5: Total count for pagination
  const totalProducts = await Product.countDocuments(productQuery);

  return {
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
    products // Return products directly without grouping
  };
};


const createProduct = async ({ name, description, price, stock, category, subcategory, imageUrls, seller,featured }) => {
  const newProduct = new Product({
    name,
    description,
    price,
    stock,
    category,
    subcategory,
    imageUrls,
    seller,
    featured
  });
  return await newProduct.save();
};


const getSellerProducts = async (sellerId) => {
  return await Product.find({ seller: sellerId });
};

module.exports = { getAllProducts, getProductsByCustomerLocation, createProduct, getSellerProducts };
