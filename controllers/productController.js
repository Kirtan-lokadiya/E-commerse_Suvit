const productService = require('../services/productService');
const Product = require('../models/Product')
const User = require('../models/User')

const getAllProducts = async (req, res) => {
  try {
    const { coordinates } = req.body;
    const products = await productService.getProductsByCustomerLocation(coordinates);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category, subCategory, page = 1, limit = 10, brand, priceMin, priceMax, sort } = req.query;

    // Construct query object based on filters
    const query = { category };
    if (subCategory) query.subCategory = subCategory;
    if (brand) query.brand = brand;
    if (priceMin && priceMax) {
      query.price = { $gte: priceMin, $lte: priceMax };
    } else if (priceMin) {
      query.price = { $gte: priceMin };
    } else if (priceMax) {
      query.price = { $lte: priceMax };
    }

    // Sorting
    const sortOptions = {};
    if (sort === 'ascending') {
      sortOptions.price = 1;
    } else if (sort === 'descending') {
      sortOptions.price = -1;
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Find products based on the constructed query
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getProductDetails = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFeaturedProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    const products = await Product.find({ category, featured: true });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;
    const sellerId = req.user.id; // Assuming the authenticated user is a seller

    const product = await productService.createProduct({ 
      name, 
      description, 
      price, 
      stock, 
      category, 
      imageUrl,
      seller: sellerId 
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const sellerId = req.user._id; 
  
    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found or not authorized to update this product' });
    }

    // Update the product
    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const sellerId = req.user._id; // Assuming the authenticated user is a seller

    // Find the product by ID and ensure it belongs to the seller
    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found or not authorized to delete this product' });
    }

    // Delete the product
    await Product.deleteOne({ _id: productId });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user._id; // Assuming the authenticated user is a seller
    const products = await productService.getSellerProducts(sellerId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const user = await User.findById(req.user.id);

    // Check if the product already exists in the user's cart
    const productIndex = user.cart.findIndex(cartItem => cartItem.toString() === productId);
    if (productIndex !== -1) {
      return res.status(400).json({ error: "Product already exists in cart" });
    }

    // Add the ObjectId of the product to the user's cart
    user.cart.push(productId);
    await user.save();
    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const deleteFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);

    // Remove the product from the user's cart
    user.cart.pull(productId);
    await user.save();

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getCartItems = async (req, res) => {
  try {
    // Fetch the authenticated user and populate the cart array with products
    const user = await User.findById(req.user.id).populate({
      path: 'cart',
      model: 'Product'
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract product details from the user's cart
    const cartItems = user.cart.map(item => ({
      _id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl
      // Add other product details as needed
    }));

    res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getAllProducts,getProductDetails, getCartItems, getProductsByCategory, getFeaturedProductsByCategory,createProduct, updateProduct, deleteProduct, getSellerProducts , addToCart, deleteFromCart};
