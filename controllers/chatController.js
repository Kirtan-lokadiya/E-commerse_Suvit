const mongoose = require('mongoose');
const ChatMessage = require('../models/ChatMessage');

const getMessages = async (req, res) => {
  const { customerId, adminId } = req.params;


  try {
    const customerObjectId = new mongoose.Types.ObjectId(customerId);
    const adminObjectId = new mongoose.Types.ObjectId(adminId);

    // Fetch chat history between the specific customer and admin
    const chatHistory = await ChatMessage.find({
      $or: [
        { senderId: customerObjectId, receiverId: adminObjectId },
        { senderId: adminObjectId, receiverId: customerObjectId }
      ]
    }).sort({ timestamp: 'asc' });
    res.json(chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

module.exports = {
  getMessages
};
