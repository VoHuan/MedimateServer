const { Token } = require('../models/index');
const asyncErrorWrapper = require('../Utils/AsyncErrorWrapper');

exports.saveToken = asyncErrorWrapper(async (userId, refreshToken) => {
    //console.log(userId, refreshToken)
    const [token, created] = await Token.findOrCreate({
        where: { id_user: userId},
        defaults: { id_user: userId, refresh_token: refreshToken } // create with new token 
      });
  
      if (!created) {
        token.refresh_token = refreshToken;
        await token.save();
      }
  
      return  token;
});