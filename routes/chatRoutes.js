const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/history/:customerId/:adminId',  chatController.getMessages);

module.exports = router;
