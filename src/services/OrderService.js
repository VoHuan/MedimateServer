const { Order, OrderDetail, User, RedeemedCoupon, Cart, RedeemedCoupone } = require('../models/index');
const asyncErrorWrapper = require('../Utils/AsyncErrorWrapper');
const { customAlphabet } = require('nanoid');
const { Op } = require('sequelize');

exports.getAllOrdersByUserId = asyncErrorWrapper(async (userId) => {
    const orders = await Order.findAll({
        where: { id_user: userId },
        include: [{
            model: User,
            as: 'user',
            attributes: ['phone', 'email', 'username']
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

exports.createOrder = asyncErrorWrapper(async (listCartItem, order) => {
    // 1. Tạo đơn hàng mới
    order.code = generateOrderCode();
    const newOrder = await Order.create(order);

    if (newOrder) {
        // 2. Thêm các mặt hàng vào chi tiết đơn hàng
        const listOrderItem = listCartItem.map(item => ({
            id_order: newOrder.id,
            id_product: item.product.id,
            productPrice: item.product.price,
            discountPrice: item.product.price * item.product.discountPercent,
            quantity: item.quantity
        }));
        
        await OrderDetail.bulkCreate(listOrderItem);

        // 3. Cộng điểm thưởng cho người dùng
        const user = await User.findByPk(order.id_user);
        user.point += order.point;
        await user.save();

        // 4. Xóa mục giỏ hàng
        const productIds = listCartItem.map(item => item.product.id);
        await Cart.destroy({
            where: {
                id_product: { [Op.in]: productIds },
                id_user : user.id
            }
        });

        // 5.cập nhật mã khuyến mãi đã sử dụng (update status)
        if(order.redeemedCouponId){
            const redeemedCoupon = await RedeemedCoupon.findByPk(order.redeemedCouponId);
            redeemedCoupon.status = 0;
            await redeemedCoupon.save();
        }
    }
    return newOrder;
});



const generateOrderCode = () => {
    const alphabetNanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);
    const now = Date.now();
    const strings = alphabetNanoid() + now
    let characters = strings.split('');
    for (let i = characters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [characters[i], characters[j]] = [characters[j], characters[i]];
    }

    return "HD" + characters.join('').toUpperCase();
}