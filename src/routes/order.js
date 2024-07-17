const express = require('express');
const router = express.Router();

const orderController = require('../controllers/OrderController');
const authController = require('../controllers/AuthController');


router.route('/')
    .get(authController.protect, orderController.getAllAddressesByUserId)

router.route('/momo')
    .post(authController.protect, orderController.createOrderWithMoMo)
    
router.route('/cod')
    .post(authController.protect, orderController.createOrderWithCOD)

module.exports = router;