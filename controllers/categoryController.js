// app/controllers/categoryController.js
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

// Retrieve main categories
const getMainCategories = async (req, res) => {
  try {
    const mainCategories = await Category.find();
    res.json(mainCategories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Retrieve subcategories of a main category
const getSubcategoriesOfMainCategory = async (req, res) => {
  const mainCategoryId = req.params.mainCategoryId;
  try {
    // Find all subcategories where parentCategory matches the mainCategoryId
    const subcategories = await Subcategory.find({ parentCategory: mainCategoryId });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new category (main category or subcategory)
const createCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    // Check if parentCategory is provided and exists
    if (parentCategory) {
      // Creating a subcategory
      const subcategory = new Subcategory({
        name,
        parentCategory
      });
      await subcategory.save();
      res.status(201).json({ message: 'Subcategory created successfully', category: subcategory });
    } else {
      // Creating a main category
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ error: 'Category with the same name already exists' });
      }
      const category = new Category({
        name
      });
      await category.save();
      res.status(201).json({ message: 'Category created successfully', category });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getMainCategories,
  getSubcategoriesOfMainCategory,
  createCategory
};
