const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  imageUrls: [{type: String }],
  featured: { type: Boolean },
  deleted: { type: Boolean, default: false } ,
  brand: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
