const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/config');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const sellerproductRoutes = require('./routes/sellerproductRoutes');
const customerproductRoutes = require('./routes/customerproductRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes'); 
const commentRoutes = require('./routes/commentRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');

require('./config/passport'); // Ensure passport config is required

// Initialize Express app
const app = express();

app.use(cors({
  origin: ['http://192.168.20.169:3000', 'http://localhost:3000']
}));

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: config.jwtSecret,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(config.mongodbUrl, {
  family: 4 // Force to use IPv4
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Use routes
app.use('/api/auth/customer', authRoutes); 
app.use('/api/auth/sellers', sellerRoutes);
app.use('/api/users-update', userRoutes);
app.use('/api/seller/products', sellerproductRoutes);
app.use('/api/customer/products', customerproductRoutes);
app.use('/api/wishlist', wishlistRoutes); 
app.use('/api/orders', orderRoutes);  // Ensure orders route is used
app.use('/api/comments', commentRoutes); 
app.use('/api/categories', categoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
// const port = config.port;
const port = config.port;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
