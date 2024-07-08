const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');

router.route('/')
    .get(authController.protect, userController.getUser)
    .patch(authController.protect, userController.updateUser)

module.exports = router;