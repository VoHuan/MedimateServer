const { Cart } = require('../models/index');
const asyncErrorWrapper = require('../Utils/AsyncErrorWrapper');




exports.getCarts = asyncErrorWrapper(async (userId) => {
    const carts = await Cart.findAll({ where: { id_user: userId } });
    return carts;
});

exports.getDistinctProductCount = asyncErrorWrapper(async () => {
    const result = await Cart.findAll({
        where: { id_user: userId },
        attributes: ['id_product'],
        group: ['id_product'],
        raw: true,
    });
    return result.length;
});

exports.saveCart = asyncErrorWrapper(async (cartData) => {
    const { id_user, id_product, quantity } = cartData;
    const [cart, created] = await Cart.findOrCreate({
        where: { id_user, id_product },
        defaults: { quantity } // create with new quantity 
      });
  
      if (!created) {
        //cart.quantity = quantity;
        cart.quantity = cart.quantity + quantity;
        await cart.save();
      }
  
      return  cart;
});

exports.updateCart = asyncErrorWrapper(async (cartData) => {
    const { id_user, id_product, quantity } = cartData;
    const cart = await Cart.findOne({
        where: { id_user, id_product },
      });
      
    cart.quantity = quantity;
    await cart.save();
});

exports.deleteCart = asyncErrorWrapper(async (userId, productId) => {
    await Cart.destroy({
        where: { id_user: userId, id_product: productId},
    })
});


