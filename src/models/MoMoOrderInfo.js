const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MoMoOrderInfo = sequelize.define('MoMoOrderInfo', {
    partnerCode : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    orderId  : {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false,
    },
    requestId  : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    amount  : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    orderInfo  : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    orderType  : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    transId  : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    resultCode  : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    message  : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    payType  : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    responseTime  : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    extraData  : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    signature  : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    
}, {
    tableName: 'momo_order_info',
    timestamps: false,
});



module.exports = MoMoOrderInfo;