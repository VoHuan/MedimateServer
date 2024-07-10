const orderService = require('../services/OrderService');
const asyncErrorHandler = require('../Utils/AsyncErrorHandler');
const CustomError = require('../Utils/CustomError');

exports.getAllAddressesByUserId = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const orders= await orderService.getAllOrdersByUserId(userId);
    res.status(200).json(orders);
});