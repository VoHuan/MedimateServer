const express = require('express');
const router = express.Router();

const productController = require('../controllers/ProductController');

router.get('/', productController.getAllProduct);
router.get('/newest', productController.getNewestProduct);
router.get('/top-discounted', productController.getTopDiscountedProducts);
router.get('/discounted', productController.getAllDiscountedProducts);
router.get('/:id', productController.getProductById);

module.exports = router;