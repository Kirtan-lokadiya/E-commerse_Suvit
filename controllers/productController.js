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

const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.body;
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);

    // Find the cart item with the given product ID
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }

    // Update the quantity of the cart item
    cartItem.quantity = quantity;
    await user.save();

    res.status(200).json({ message: 'Cart item quantity updated successfully' });
  } catch (error) {
    console.error(error);
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
      categoryId: req.query.categoryId, // Add categoryId here
      subcategoryId: req.query.subcategoryId,
      sortBy: req.query.sortBy || 'price',
      sortOrder: req.query.sortOrder || 'asc',
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10
    };

    const result = await productService.getProductsByCustomerLocation(coordinates, filters);
    res.json(result);
  } catch (error) {
    console.log(error);
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
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.id);

    // Check if the product already exists in the cart
    const existingItem = user.cart.find(item => item.product.toString() === productId);

    if (existingItem) {
      // If the product exists, you can choose to prevent adding it again or update the quantity
      // For simplicity, let's prevent adding it again
      return res.status(400).json({ error: 'Product already exists in the cart' });
    }

    // If the product doesn't exist in the cart, add it
    user.cart.push({ product: productId, quantity });
    await user.save();

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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
      path: 'cart.product', // Populate the 'product' field in the 'cart' array
      model: 'Product'
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract product details from the user's cart
    const cartItems = user.cart.map(item => ({
      _id: item.product._id, // Access the product ID
      name: item.product.name,
      description: item.product.description,
      price: item.product.price,
      imageUrls: item.product.imageUrls,
      quantity: item.quantity // Include quantity in the response
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
  updateCartItemQuantity  
};
