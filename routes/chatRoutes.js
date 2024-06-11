const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');


// Import Socket.io instance
 // Assuming your Socket.io instance is exported from your main server file

router.get('/history/:customerId/:adminId',  chatController.getMessages);
router.get('/broadcast/messages',  chatController.getBroadcastMessages); // Pass io to your controller function

module.exports = router;
