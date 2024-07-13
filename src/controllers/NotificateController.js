const notificateService = require('../services/NotificateService');
const asyncErrorHandler = require('../Utils/AsyncErrorHandler');
const CustomError = require('../Utils/CustomError');

//[GET] /api/notification
exports.getNotificationsByUserId = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const notifications = await notificateService.getNotificationsByUserId(userId);
    res.status(200).json(notifications);
});

//[POST] /api/notification
//noti to user
exports.addUserNotification = asyncErrorHandler(async (req, res, next) => {
    const id_user = req.user.id;
    const notificate = req.body;
    const notification = await notificateService.addUserNotification(id_user, notificate);
    res.status(201).json(notification);
});

//[POST] /api/notification/all
//noti to all user
exports.addGlobalNotification = asyncErrorHandler(async (req, res, next) => {
    const notificate = req.body;
    const notification = await notificateService.addGlobalNotification( notificate);
    res.status(201).json(notification);
});