const asyncErrorHandler = require('../Utils/AsyncErrorHandler');
const CustomError = require('../Utils/CustomError');
const jwt = require('jsonwebtoken');
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

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    await tokenService.saveToken(user.id, refreshToken);  //save refresh token to DB

    //user.password = undefined;
    
    res.status(statusCode).json(accessToken);
};

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const newUser = await authService.signup(req.body);
    console.log(newUser)
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


// //Authorization
// exports.restrict = (...role) => {
//     return (req, res, next) => {
//         if(!role.includes(req.user.role)){
//             const error = new CustomError('You do not have permission to perform this action', 403);
//             next(error);
//         }
//         next();
//     }
// };

// exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
//     //1. get user based on post email
//     const user = await User.findOne({email: req.body.email});
//     if(!user){
//         const error = new CustomError('We could not find the user with given email', 401);
//     }
//     //2. generate a radom reset token
//     const resetToken = user.createResetPasswordToken();
//     await user.save({validateBeforeSave: false});

//     //3 send the token back to the user email
//     const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
//     const message = `We have received a password reset request. Please use the below link to reset your password\n\n
//                     ${resetUrl}\n\n
//                     This reset password link will be valid only for 10 minutes.`;
//     try {
//         await sendEmail({
//             email: user.email,
//             subject: 'Password change request received',
//             message: message,
//         });

//         res.status(200).json({
//             status: 'success',
//             message: 'Password reset link send to the user email',
//         })
//     } catch (error) {
//         user.passwordResetToken = undefined;
//         user.passwordResetTokenExpires = undefined;
//         user.save({validateBeforeSave: false});

//         return next(new CustomError('There was an error sending password reset email. Please try again later.', 500));
//     }
// });


// exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
//     // validate token
//     const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
//     const user = await User.findOne({
//         passwordResetToken: resetToken,
//         passwordResetTokenExpires: { $gt: Date.now() }
//       });
      
//     if(!user){
//         const error = new CustomError('Token is invalid or has expired!');
//         next(error);
//     }

//     // reseting the user password
//     user.password = req.body.password;
//     user.confirmPassword = req.body.confirmPassword;
//     user.passwordResetToken = undefined;
//     user.passwordResetTokenExpires = undefined;
//     user.passwordChangedAt = Date.now();
//     user.save();

//     //login the user
//     createSendRespone(user, 200, res);
    
// });


