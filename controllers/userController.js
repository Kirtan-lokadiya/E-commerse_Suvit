const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage'); 
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Existing updateUserProfile method
const updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone, address, photo } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.address = address;
    user.photo = photo;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// New updateUserLocation method
const updateUserLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.location = {
      type: 'Point',
      coordinates
    };

    await user.save();
    res.json({ message: 'Location updated successfully',coordinates });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserDetails = async (req, res) => {
  const role = req.user.role;

  try {
    if (role === 'admin') {
      // Find all unique customer IDs in chat messages involving the admin
      const customerChats = await ChatMessage.aggregate([
        {
          $match: {
            $or: [
              { senderId: new mongoose.Types.ObjectId(req.user.id) },
              { receiverId: new mongoose.Types.ObjectId(req.user.id) }
            ]
          }
        },
        {
          $group: {
            _id: null,
            customerIds: {
              $addToSet: {
                $cond: [
                  { $eq: ["$senderId", new mongoose.Types.ObjectId(req.user.id)] },
                  "$receiverId",
                  "$senderId"
                ]
              }
            }
          }
        }
      ]);

      if (!customerChats.length || !customerChats[0].customerIds.length) {
        return res.status(404).json({ error: 'No customers found in chat messages' });
      }

      // Fetch customer details for those IDs
      const customerDetails = await User.find({
        _id: { $in: customerChats[0].customerIds },
        role: 'customer'
      }).select('firstName lastName email role');

      return res.json(customerDetails);
    } else if (role === 'customer') {
      const adminDetails = await User.findOne({ role: 'admin' }).select('firstName lastName email role');

      if (!adminDetails) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      return res.json([adminDetails]);
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ error: 'Failed to fetch user details' });
  }
};
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports = { updateUserProfile, updateUserLocation, getUserDetails,searchUsers };




