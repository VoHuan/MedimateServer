const express = require('express');
const router = express.Router();

const notificateController = require('../controllers/NotificateController');
const authController = require('../controllers/AuthController');

router.route('/all').post(authController.protect, authController.restrict('admin', 'user'), notificateController.addGlobalNotification);

router.route('/')
    .get(authController.protect, notificateController.getNotificationsByUserId)
    .post(authController.protect, notificateController.addUserNotification)

module.exports = router;