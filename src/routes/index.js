const productRouter = require('./product');


function route(app) {
    app.use('/api/product', productRouter);
    
}

module.exports = route;