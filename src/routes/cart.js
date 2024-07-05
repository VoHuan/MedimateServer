const express = require('express');
const router = express.Router();

const cartController = require('../controllers/CartController');

router.route('/distinct-product-count').get(cartController.getDistinctProductCount);

router.route('/')
    .get(cartController.getCarts)
    .post(cartController.saveCart)
    .patch(cartController.updateCart)


router.route('/:id')
    .delete(cartController.deleteCart)

    
module.exports = router;