const orderService = require('../services/OrderService');
const asyncErrorHandler = require('../Utils/AsyncErrorHandler');
const CustomError = require('../Utils/CustomError');



exports.getAllAddressesByUserId = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const orders = await orderService.getAllOrdersByUserId(userId);
    res.status(200).json(orders);
});

exports.createOrderWithCOD = asyncErrorHandler(async (req, res, next) => {
    const { id: userId } = req.user;
    const { listCartItem, order } = req.body;

    order.userId = userId;

    const newOrder = await orderService.createOrderWithCOD(listCartItem, order);
    return res.status(201).json(newOrder);

});

exports.createOrderWithMoMo = asyncErrorHandler(async (req, res, next) => {
    const { id: userId } = req.user;
    const { listCartItem, order } = req.body;
    
    order.userId = userId;

    const deeplink = await orderService.createOrderWithMoMo(listCartItem, order);
        
    return res.status(201).json({ deeplink: deeplink });
});


