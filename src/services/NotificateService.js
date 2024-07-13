const { Notificate } = require('../models/index');
const asyncErrorWrapper = require('../Utils/AsyncErrorWrapper');
const { Op } = require('sequelize');

exports.getNotificationsByUserId = asyncErrorWrapper(async (userId) => {
    const notifications = await Notificate.findAll({
        where: {
            [Op.or]: [
                { id_user: userId },
                { id_user: null }   //id_user = null is global notification
            ]
        }
    });
    return notifications;
});

//noti to user
exports.addUserNotification = asyncErrorWrapper(async (userId, notificate) => {
    notificate.id_user = userId;
    const notifications = await Notificate.create(notificate);
    return notifications;
});

//noti to all user
exports.addGlobalNotification = asyncErrorWrapper(async (notificate) => {
    const notifications = await Notificate.create(notificate);
    return notifications;
});