const { Order, OrderDetail, User, RedeemedCoupon, Cart, RedeemedCoupone } = require('../models/index');
const MoMoOrderInfo = require('../models/MoMoOrderInfo');
const createMomoRequest = require('../Payment/MoMo/CreateMomoRequest');
const createZaloPayRequest = require('../Payment/ZaloPay/CreateZalopayRequest');
const asyncErrorWrapper = require('../Utils/AsyncErrorWrapper');
const { customAlphabet } = require('nanoid');
const { Op } = require('sequelize');
const CustomError = require('../Utils/CustomError');
const { el } = require('date-fns/locale');



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

async function getOrderByCode(code) {
    const order = await Order.findOne({
        where: { code: code },
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
    return order;
};

exports.getOrderByCode = asyncErrorWrapper(getOrderByCode);

exports.createOrderWithCOD = asyncErrorWrapper(async (listCartItem, order) => {

    order.code = generateOrderCode();
    order.status = 1; //success
    const newOrder = await Order.create(order);

    if (newOrder) {
        await handleOrderCompletion(listCartItem, newOrder);
    }
    return newOrder;
});


exports.createOrderWithMoMo = asyncErrorWrapper(async (listCartItem, order) => {

    const orderCode = generateOrderCode();
    const amount = order.total;

    //1. gửi yêu cầu thanh toán đến momo
    const result = await createMomoRequest.sendMoMoReq(orderCode, amount);

    if (result.resultCode !== 0) { // Gửi request thất bại
        const error = new CustomError('Bad Gateway: The server received an invalid response from the upstream server', 502)
        throw error;
    }
    // 2. Tạo đơn hàng mới
    order.code = orderCode;
    order.status = 2; //pending 
    const newOrder = await Order.create(order);

    if (newOrder) {
        await handleOrderCompletion(listCartItem, newOrder);  //Process data related to orders : cart, point, coupon, ...
    }
    return result;
});

exports.saveMoMoOrderInfo = asyncErrorWrapper(async (orderInfo) => {
    const momoOrderInfo = await MoMoOrderInfo.create(orderInfo);
    return momoOrderInfo;
});


const handleOrderCompletion = asyncErrorWrapper(async (listCartItem, order) => {
    // 1.Thêm các mặt hàng vào chi tiết đơn hàng
    const listOrderItem = listCartItem.map(item => ({
        id_order: order.id,
        id_product: item.product.id,
        productPrice: item.product.price,
        discountPrice: item.product.price * item.product.discountPercent,
        quantity: item.quantity
    }));

    await OrderDetail.bulkCreate(listOrderItem);

    // 2. Cộng điểm thưởng cho người dùng
    const user = await User.findByPk(order.userId);
    user.point += order.point;
    await user.save();

    // 3. Xóa mục giỏ hàng
    const productIds = listCartItem.map(item => item.product.id);
    await Cart.destroy({
        where: {
            id_product: { [Op.in]: productIds },
            id_user: user.id
        }
    });

    // 4. Cập nhật mã khuyến mãi đã sử dụng (update status)
    if (order.redeemedCouponId !== 0) {
        const redeemedCoupon = await RedeemedCoupon.findByPk(order.redeemedCouponId);
        if (!redeemedCoupon) {
            const error = new CustomError('The redeemed has been used!', 400);
            throw error;
        }
        let currentDate = new Date(Date.now());
        if (redeemedCoupon.expiryDate.getTime() < currentDate) {
            const error = new CustomError('The redeemed coupon has expired!', 400);
            throw error;
        }
        redeemedCoupon.status = 0;
        await redeemedCoupon.save();
    }
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
};

const handleUpdateOrderStatus = asyncErrorWrapper(async (orderCode, status) => {
    const order = await getOrderByCode(orderCode);
    if(order){
        order.status = status;
        await order.save();
    }
});

exports.handleUpdateOrderStatus = asyncErrorWrapper(handleUpdateOrderStatus);

exports.createOrderWithZaloPay = asyncErrorWrapper(async (listCartItem, order, username) => {
    const orderCode = generateOrderCode();
    const amount = order.total;

    //1. gửi request thanh toán tới Zalopay
    const result = await createZaloPayRequest.sendZaloPayReq(listCartItem, amount, orderCode, username);
    if (result.return_code !== 1) { // Gửi request thất bại
        const error = new CustomError(result.return_message, 502)
        throw error;
    }

    // 2. Tạo đơn hàng mới
    order.code = orderCode;
    order.status = 2; //pending 
    const newOrder = await Order.create(order);

    if (newOrder) {
        await handleOrderCompletion(listCartItem, newOrder);  //Process data related to orders : cart, point, coupon, ...
    }

    return result;
});



exports.monitorZaloPayOrderStatus = asyncErrorWrapper(async (app_trans_id) => {
    const orderId = app_trans_id.split('_')[1];

    const checkInterval = 30000; // Kiểm tra mỗi 30 giây
    const maxDuration = 15 * 60 * 1000; // 15 phút
    let startTime = Date.now();

    const performCheck = async () => {

        try {
            const result = await createZaloPayRequest.checkZaloPayOrderStatus(app_trans_id);

            console.log("Checking zalopay order status: ",result.return_code);

            if (result.return_code === 1) {
                await handleUpdateOrderStatus(orderId, 1); 
                return; 
            } else if (result.return_code === 2) {
                await handleUpdateOrderStatus(orderId, 0); 
                return; 
            } else if (result.return_code === 3 && Date.now() - startTime < maxDuration) {
                setTimeout(performCheck, checkInterval);
            } else {
                await handleUpdateOrderStatus(orderId, 0);
            }
        } catch (error) {
            console.error(`Error checking ZaloPay order status for order ${orderId}:`, error);
            await handleUpdateOrderStatus(orderId, 0); 
        }

    };

    performCheck(); 
});




