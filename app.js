const express = require('express');
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/config');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const socketio = require('socket.io');
const http = require('http');
const ChatMessage = require('./models/ChatMessage'); 

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
const { log } = require('console');

require('./config/passport'); 

const app = express();

const server = http.createServer(app);
const io = socketio(server, {
  pingTimeout: 60000,
  cors: {
    origin: ['http://192.168.20.169:3000', 'http://localhost:3000']
}});

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

// Socket.io
io.on('connection', (socket) => {
  console.log('New client connected',socket.id);


  socket.on('chat message', async (msg) => {
    const { senderId, receiverId, message } = msg;
    
    try {
      // Convert senderId and receiverId to ObjectId type
      const senderObjectId =new ObjectId(senderId);
      const receiverObjectId = new ObjectId(receiverId);

      // Create a new ChatMessage document
      const chatMessage = new ChatMessage({
        senderId: senderObjectId,
        receiverId: receiverObjectId,
        message: message
      });

      // Save the message to the database
      await chatMessage.save();

    
      if (receiverId) {
        // console.log(`chat message with this id ${senderId} + ${receiverId}`);
        io.emit(`chat message ${senderId} ${receiverId}`, msg);
        
      } else {
        console.log(`Receiver socket with ID ${receiverId} not found.`);
      }
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
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
server.listen(port, () => { // <-- Changed from app.listen to server.listen
  console.log(`Server is running on port ${port}`);
});
