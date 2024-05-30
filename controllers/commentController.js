const Comment = require('../models/Comment');
const Product = require('../models/Product');
const User = require('../models/User');

// Add Comment
const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, text, rating } = req.body;

    // Check if the user has already commented on this product
    const existingComment = await Comment.findOne({ user: userId, product: productId });
    if (existingComment) {
      return res.status(400).json({ error: 'You have already commented on this product.' });
    }

    // Create a new comment
    const comment = new Comment({
      user: userId,
      product: productId,
      text,
      rating
    });

    await comment.save();

    // Return only the comment details without populating the user
    res.status(201).json({
      _id: comment._id,
      text: comment.text,
      rating: comment.rating,
      createdAt: comment.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get Comments for a Product
const getComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await Comment.find({ product: productId }).populate('user', 'firstName lastName');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Assuming req.user is set by the authMiddleware

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await comment.deleteOne(); // Using deleteOne instead of remove
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment
};
