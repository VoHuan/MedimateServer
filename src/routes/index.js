const productRouter = require('./product');
const cartRouter = require('./cart');
const authRouter = require('./auth');
const userRouter = require('./user');
const CustomError = require('../Utils/CustomError');


function route(app) {
    app.use('/api/product', productRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);

    app.all('*', (req, res, next) => {
        const err = new CustomError(`Can't find ${req.originalUrl} on the server !`, 404);
        next(err);
    });  
}

module.exports = route;