// app/controllers/categoryController.js
const Category = require('../models/Category');
const categoryService = require('../services/categoryService');

// Controller functions
const getMainCategories = async (req, res) => {
  try {
    const mainCategories = await categoryService.getMainCategories();
    res.json(mainCategories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSubcategoriesOfMainCategory = async (req, res) => {
  const mainCategoryId = req.params.mainCategoryId;
  try {
    const subcategories = await categoryService.getSubcategoriesOfMainCategory(mainCategoryId);
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category with the same name already exists' });
    }

    // Create a new category
    const category = new Category({
      name,
      parentCategory: parentCategory // Set the parent category ID
    });

    // Save the category to the database
    await category.save();

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getMainCategories,
  getSubcategoriesOfMainCategory,
  createCategory
};
