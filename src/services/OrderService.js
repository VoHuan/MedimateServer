const { Order, User, RedeemedCoupon } = require('../models/index');
const asyncErrorWrapper = require('../Utils/AsyncErrorWrapper');

exports.getAllOrdersByUserId = asyncErrorWrapper(async (userId) => {
    const orders = await Order.findAll({
        where: {id_user: userId},
        include: [{
            model: User,
            as: 'user',
            attributes: [ 'phone', 'email', 'username']
        },
        {
            model: RedeemedCoupon,
            as: 'redeemed_coupons',
            attributes: ['code',],
        },
    ],
        attributes: { exclude: ['id_user', 'id_redeemed_coupon'] } 
    });
    return orders;
});