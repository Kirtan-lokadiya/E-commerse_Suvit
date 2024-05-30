// app/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const sellerController = require('../controllers/sellerController');
const isAdmin = require('../middlewares/isAdmin')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/main', categoryController.getMainCategories);
router.get('/:mainCategoryId/subcategories', categoryController.getSubcategoriesOfMainCategory);
router.post('/add-categories', authMiddleware, isAdmin, categoryController.createCategory);
router.get('/sellers',authMiddleware, isAdmin, sellerController.getAllSellers);



module.exports = router;
