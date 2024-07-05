const CustomError = require('../Utils/CustomError');

const devErrors = (err, res) => {
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
        stackTrace: err.stack,
        error: err,
    });
};

const prodErrors = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Somethings went wrong! Please try again later.',
        });
    }

}


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        devErrors(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        prodErrors(err, res);
    }
}