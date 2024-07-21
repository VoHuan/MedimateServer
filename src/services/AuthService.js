const {User, Token} = require('../models/index');
const util = require('util');
const jwt = require('jsonwebtoken');
const asyncErrorWrapper = require('../Utils/AsyncErrorWrapper');
const CustomError = require('../Utils/CustomError');




exports.signup = asyncErrorWrapper(async (userData) => {
    const user = await User.create(userData, { fields: ['phone','password','confirmPassword','passwordChangedAt'] });
    return user;
});

exports.login = asyncErrorWrapper(async (phoneNumber, password, next) => {
    if(!phoneNumber || !password){
        const error = new CustomError('Please provide phone number and password for login!', 400);
        throw error;
    }
    const user = await User.scope('withPassword').findOne({ where: { phone: phoneNumber } });

    if(!user){
        const error = new CustomError(`The user login with phone number: ${phoneNumber} does not exits`, 401)
        throw error;
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        const error = new CustomError('Incorrect password!', 400);
        throw error;
    }

    return user;
});

exports.protect = asyncErrorWrapper(async (authHeader) => {
    //1. Read the token & check if it exits
    const accessToken = authHeader && authHeader.startsWith('Bearer') && authHeader.split(' ')[1]; // Bearer <token>
    if(!accessToken){
        const error = new CustomError('You are not logged in!', 401);
        throw error;
    }
    //2. validate token
    const decodedAccessToken = await util.promisify(jwt.verify)(accessToken, process.env.ACCESS_SECRECT_STR);
    const token = await Token.findOne({ where: { id_user: decodedAccessToken.id }});
        //if DB not have refresh token
    if (!token) {
        const error = new CustomError('Invalid session. Please login again!', 401);
        throw error;
    }
    const decodedRefreshToken = await util.promisify(jwt.verify)(token.refresh_token, process.env.REFRESH_SECRECT_STR);
        //if refresh token was changed
    if (decodedAccessToken.iat * 1000 < decodedRefreshToken.iat * 1000) {
        const error = new CustomError('Your session has expired. Please login again!', 401);
        throw error;
    }
    //3. If the user does not exits
    const user = await User.findByPk(decodedAccessToken.id);
    if(!user){
        const error = new CustomError('The user with the given token does not exits', 401)
        throw error;
    }
    //4. If the user changed password after the token was issued
    const isPasswordChanged = await user.isPasswordChanged(decodedAccessToken.iat);
    if(isPasswordChanged){
        const error = new CustomError('The password has been changed recently. Please login again!', 401)
        throw error;
    }
    //5. Allow user to access route
    return user;
});

