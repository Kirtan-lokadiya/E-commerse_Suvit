const mongoose = require('mongoose');
const ChatMessage = require('../models/ChatMessage');
const Seller = require('../models/Seller');
const Group = require('../models/GroupSchema');

const getMessages = async (req, res) => {
  const { customerId, adminId } = req.params;


  try {
    const customerObjectId = new customerId;
    const adminObjectId = new adminId;

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

const getBroadcastMessages = async (req, res) => {
  try {
    const messages = await Group.find({}).sort({ timestamp: 1 });

    // Extract only the message field from each object
    const messageTexts = messages.map(message => message.message);

    // Send only the array of message texts in the response
    res.status(200).json(messageTexts);
  } catch (error) {
    console.error('Error fetching broadcast messages:', error);
    res.status(500).send('Internal Server Error');
  }
};



module.exports = {
  getMessages,

  getBroadcastMessages
};
