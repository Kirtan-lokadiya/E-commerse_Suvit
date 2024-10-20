const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/config');
const cors = require('cors');
const ChatMessage = require('./models/ChatMessage');
const Group = require('./models/GroupSchema'); // Import Group model
const Seller = require('./models/Seller'); // Import Seller model

// Import routes
const authRoutes = require('./routes/authRoutes');
const sellerproductRoutes = require('./routes/sellerproductRoutes');
const customerproductRoutes = require('./routes/customerproductRoutes');
const userRoutes = require('./routes/userRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const commentRoutes = require('./routes/commentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const chatRoutes = require('./routes/chatRoutes');

require('./config/passport');

const app = express();

const server = http.createServer(app);
const io = socketio(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      'http://192.168.20.169:3000', 
      'http://localhost:3000',
      'https://e-commerce-suvit.onrender.com',
      'https://e-commerse-suvit-git-main-kirtan-lokadiyas-projects.vercel.app',
      'https://e-commerse-suvit.vercel.app'
    ]
  }
});


app.use(cors({
  origin: [
    'http://192.168.20.169:3000', 
    'http://localhost:3000', 
    'https://e-commerce-suvit.onrender.com',
    'https://e-commerse-suvit-git-main-kirtan-lokadiyas-projects.vercel.app',
    'https://e-commerse-suvit.vercel.app'  // Add this missing origin
  ],
  credentials: true  // If you're using cookies or credentials
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

// Socket.io
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  // Save seller's socket ID when they connect
  socket.on('registerSeller', async (sellerId) => {
    try {
      const updatedSeller = await Seller.findByIdAndUpdate(sellerId, { socketId: socket.id }, { new: true });
      if (updatedSeller) {
        console.log(`Seller ${sellerId} registered with socket ID ${socket.id}`);
      } else {
        console.log(`Seller with ID ${sellerId} not found or connection through Admin`);
      }
    } catch (error) {
      console.error('Error registering seller:', error);
    }
  });

  socket.on('chat message', async (msg) => {
    const { senderId, receiverId, message } = msg;

    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId(senderId) || !isValidObjectId(receiverId)) {
      return res.status(400).json({ error: 'Invalid senderId or receiverId' });
    }
    try {
      const senderObjectId = new mongoose.Types.ObjectId(senderId);
      const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

      const chatMessage = new ChatMessage({
        senderId: senderObjectId,
        receiverId: receiverObjectId,
        message: message
      });

      await chatMessage.save();

      if (receiverId) {
        io.emit(`chat message ${senderId} ${receiverId}`, msg);
      } else {
        console.log(`Receiver socket with ID ${receiverId} not found.`);
      }
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  });

  // Broadcast message from admin to all sellers
  socket.on('broadcast message', async (data) => {
    const { adminId, message } = data;

    try {
      const sellers = await Seller.find({ deleted: false });
      const receiverIds = sellers.map(seller => seller._id);

      const groupMessage = new Group({
        name: 'Broadcast Message',
        senderId: adminId,
        receiverIds: receiverIds,
        message: message
      });

      await groupMessage.save();

      sellers.forEach(seller => {
        if (seller.socketId) {
          io.to(seller.socketId).emit('broadcast message', { adminId, message });
        }
      });
    } catch (error) {
      console.error('Error broadcasting message:', error);
    }
  });

  // Remove seller's socket ID when they disconnect
  socket.on('disconnect', async () => {
    console.log('Client disconnected', socket.id);
    await Seller.updateMany({ socketId: socket.id }, { $unset: { socketId: 1 } });
  });
});

// Use routes
app.use('/api/auth/customer', authRoutes);
app.use('/api/auth/sellers', sellerRoutes);
app.use('/api/users-update', userRoutes);
app.use('/api/seller/products', sellerproductRoutes);
app.use('/api/customer/products', customerproductRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', checkoutRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
const port = config.port;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
