const productRouter = require('./product');
const cartRouter = require('./cart');
const authRouter = require('./auth');
const CustomError = require('../Utils/CustomError');


function route(app) {
    app.use('/api/product', productRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/auth', authRouter);

    app.all('*', (req, res, next) => {
        const err = new CustomError(`Can't find ${req.originalUrl} on the server !`, 404);
        next(err);
    });  
}

module.exports = route;