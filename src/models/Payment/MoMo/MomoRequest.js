const crypto = require('crypto');

function createMoMoReq (orderId, amount)  {
    var accessKey = process.env.MOMO_ACCESS_KEY;
    var secretKey = process.env.MOMO_SECRECT_KEY;
    var orderInfo = 'Thanh toán cho đơn hàng tại Medimate';
    var partnerCode = 'MOMO';
    var redirectUrl = 'myapp://momo-payment-completed';
    var ipnUrl = 'https://google.com.vn'; //ping to this URL if payment success
    var requestType = "captureWallet";
    var requestId = orderId;
    var extraData = '';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';
    var orderExpireTime = 1; // minutes


    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    var signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');


    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "TestMoMo",
        storeId: "Medimate",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderExpireTime: orderExpireTime,
        orderGroupId: orderGroupId,
        signature: signature
    });

    return requestBody;
}

module.exports = createMoMoReq;