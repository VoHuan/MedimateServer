const cartService = require('../services/CartService');
const asyncErrorHandler = require('../Utils/AsyncErrorHandler');
const CustomError = require('../Utils/CustomError');

//[GET] /api/cart
exports.getCarts = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const carts = await cartService.getCarts(userId);
    res.status(200).json(carts);

});

//[GET] /api/distinct-product-count
exports.getDistinctProductCount = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const result = await cartService.getDistinctProductCount(userId);
    res.status(200).json(result);
});

//[POST] /api/cart
exports.saveCart = asyncErrorHandler(async (req, res, next) => {
    const cart = await cartService.saveCart(req.body);
    res.status(201).json(cart);
});

//[PATCH] /api/cart
exports.updateCart = asyncErrorHandler(async (req, res, next) => {
    await cartService.updateCart(req.body);
    res.status(204).end();
});

//[DELETE] /api/cart
exports.deleteCart = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const productId = req.params.id;
    await cartService.deleteCart(userId, productId);
    res.status(204).end();
});

