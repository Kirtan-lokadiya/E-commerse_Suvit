const express = require('express');

const path = require('path');
const productController = require('../controllers/productController');
const sellerMiddleware = require('../middlewares/sellerMiddleware');
const fileUpload = require('express-fileupload');
const router = express.Router();


router.use(fileUpload());

router.post('/createproduct', sellerMiddleware,  productController.createProduct);


router.delete('/delete-product/:id', sellerMiddleware, productController.deleteProduct);
router.get('/sales',sellerMiddleware ,productController.getTotalSalesBySeller);

router.get('/own-products', sellerMiddleware, productController.getOwnProducts);
router.put('/:id', sellerMiddleware, productController.updateProductByseller);
router.get('/order', sellerMiddleware, productController.getOrdersForSeller);




module.exports = router;
