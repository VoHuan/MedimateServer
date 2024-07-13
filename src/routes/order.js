const express = require('express');
const router = express.Router();

const orderController = require('../controllers/OrderController');
const authController = require('../controllers/AuthController');


router.route('/')
    .get(authController.protect, orderController.getAllAddressesByUserId)
    .post(authController.protect, orderController.createOrder)

module.exports = router;