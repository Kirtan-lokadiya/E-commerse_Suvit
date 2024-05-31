const express = require('express');
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const sellerMiddleware = require('../middlewares/sellerMiddleware');
const fileUpload = require('express-fileupload');
const router = express.Router();


router.use(fileUpload());

router.post('/createproduct', sellerMiddleware,  productController.createProduct);


router.delete('/delete-product/:id', sellerMiddleware, productController.deleteProduct);

module.exports = router;
