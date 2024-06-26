// app/services/categoryService.js
const Category = require('../models/Category');
const SubCategory = require('../models/Subcategory');

const getMainCategories = async () => {
  try {
    const mainCategories = await Category.find({ parentCategory: null });
    return mainCategories;
  } catch (error) {
    console.error("Error fetching main categories:", error);
    throw error;
  }
};

const getSubcategoriesOfMainCategory = async (mainCategoryId) => {
  try {
    const subcategories = await SubCategory.find({ parentCategory: mainCategoryId });
    return subcategories;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

module.exports = {
  getMainCategories,
  getSubcategoriesOfMainCategory
};
