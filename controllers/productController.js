const productService = require('../services/productService');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const path = require('path');
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, subcategoryId, featured } = req.body;
    const sellerId = req.user.id; // Assuming the authenticated user is a seller
    
    // Validate that required fields are present
    if (!name || !description || !price || !stock || !categoryId || !subcategoryId || !req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'All fields are required and at least one image must be uploaded' });
    }
    
    // Handle the uploaded files
    const imageUrls = [];
    const promises = [];
    for (const key in req.files) {
      if (Object.hasOwnProperty.call(req.files, key)) {
        const element = req.files[key];
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${element.name}-${uniqueSuffix}${path.extname(element.name)}`;
        const filePath = path.join(__dirname, `../uploads/${filename}`);
        
        promises.push(new Promise((resolve, reject) => {
          element.mv(filePath, (err) => {
            if (err) {
              console.error('Error uploading file:', err);
              reject(err);
            } else {
              imageUrls.push(`/uploads/${filename}`);
              resolve();
            }
          });
        }));
      }
    }
    
    // Wait for all file upload promises to resolve
    await Promise.all(promises);
    
    // Create the product
    const product = await productService.createProduct({ 
      name, 
      description, 
      price, 
      stock, 
      category:categoryId, 
      subcategory:subcategoryId, 
      imageUrls, 
      seller: sellerId ,
      featured
    });

    res.status(201).json("Product created successfully");
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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


const getAllProducts = async (req, res) => {
  try {
    const { coordinates } = req.body;
    const filters = {
      minPrice: req.query.minPrice || 0,
      maxPrice: req.query.maxPrice || 50000,
      subcategoryId: req.query.subcategoryId,
      sortBy: req.query.sortBy || 'price',
      sortOrder: req.query.sortOrder || 'asc',
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10
    };

    const result = await productService.getProductsByCustomerLocation(coordinates, filters);
    res.json(result);
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

const getTrendingProductsByCategory = async (req, res) => {
  try {
    const categories = await Category.find({});

    const trendingProductsByCategory = [];

    for (const category of categories) {
      const trendingProducts = await Product.aggregate([
        { $match: { category: category._id, featured: true } },
      ]);

      trendingProductsByCategory.push({
        category: category.name,
        trendingProducts
      });
    }

    res.json(trendingProductsByCategory);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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
      imageUrls: item.imageUrls
 
    }));

    res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllProductsforAdmin = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({
        path: 'seller',
        select: 'firstName lastName email'
      })
      .exec();

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
};

module.exports = {
  getAllProducts,
  getProductDetails,
  getCartItems,
  
  getTrendingProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getAllProductsforAdmin,
  addToCart,
  deleteFromCart,
  
};
