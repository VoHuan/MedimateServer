const {User} = require('../models/index');
const util = require('util');
const jwt = require('jsonwebtoken');
const asyncErrorWrapper = require('../Utils/AsyncErrorWrapper');
const CustomError = require('../Utils/CustomError');




exports.signup = asyncErrorWrapper(async (userData) => {
    const user = await User.create(userData, { fields: ['phone','password','passwordChangedAt'] });
    return user;
});

exports.login = asyncErrorWrapper(async (phoneNumber, password, next) => {
    if(!phoneNumber || !password){
        const error = new CustomError('Please provide phone number and password for login!', 400);
        return error;
    }
    const user = await User.scope('withPassword').findOne({ where: { phone: phoneNumber } });

    if(!user){
        const error = new CustomError(`The user login with phone number: ${phoneNumber} does not exits`, 401)
        return error;
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        const error = new CustomError('Incorrect phone number', 400);
        return error;
    }

    return user;
});

exports.protect = asyncErrorWrapper(async (req, res, next) => {
    //1. Read the token & check if it exits
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer') && authHeader.split(' ')[1]; // Bearer <token>
    if(!token){
        const error = new CustomError('You are not logged in!', 401);
        return next(error);
    }
    //2. validate token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.ACCESS_SECRECT_STR);
  
    //3. If the user does not exits
    const user = await User.findByPk(decodedToken.id);
    if(!user){
        const error = new CustomError('The user with the given token does not exits', 401)
        return next(error);
    }
    //4. If the user changed password after the token was issued
    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
    if(isPasswordChanged){
        const error = new CustomError('The password has been changed recently. Please login again!', 401)
        return next(error);
    }
    //5. Allow user to access route
    req.user = user;
    next();
});

