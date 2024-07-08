const asyncErrorHandler = require('../Utils/AsyncErrorHandler');
const CustomError = require('../Utils/CustomError');
const jwt = require('jsonwebtoken');
const util = require('util');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const authService = require('../services/AuthService');
const tokenService = require('../services/TokenService');
const { User } = require('../models');


const signAccessToken = id =>{
    return jwt.sign({ id: id }, process.env.ACCESS_SECRECT_STR, {
        expiresIn: process.env.ACCESS_EXPIRES
      });
}


const signRefreshToken = id =>{
    return jwt.sign({ id: id }, process.env.REFRESH_SECRECT_STR, {
        expiresIn: process.env.REFRESH_EXPIRES
      });
}


const createSendRespone = async (user, statusCode, res) =>{

    const refreshToken = signRefreshToken(user.id);
    const accessToken = signAccessToken(user.id);
    await tokenService.saveToken(user.id, refreshToken);  //save refresh token to DB

    //user.password = undefined;
    
    res.status(statusCode).json({accessToken});
};

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const newUser = await authService.signup(req.body);
    //console.log(newUser)
    createSendRespone(newUser, 201, res);
    
});

exports.login = asyncErrorHandler(async (req, res, next) => {

    const {phone, password} = req.body;

    const user = await authService.login(phone, password, next);
    if (typeof user === 'object' && user instanceof User)
        //user is User
        createSendRespone(user, 200, res);  
    else
        // user is Error
        next(user)
});


exports.logout = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    await tokenService.destroyToken(userId);
    res.status(204).end();
});

exports.refreshAccessToken = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const accessToken = signAccessToken(userId);
    res.status(200).json({accessToken});    
});

//Authentication
exports.protect = asyncErrorHandler(async (req, res, next) => {
    await authService.protect(req, res, next);
})


//Authorization
exports.restrict = (...role) => {
    return (req, res, next) => {
        if(!role.includes(req.user.role)){
            const error = new CustomError('You do not have permission to perform this action', 403);
            next(error);
        }
        next();
    }
};