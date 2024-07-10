const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    require: true,
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'payment_method' 
  },
  totalCouponDiscount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'total_coupon_discount',
    defaultValue: 0,
  },
  totalProductDiscount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'total_product_discount',
    defaultValue: 0,
  },
  totalDiscount: {
    type: DataTypes.VIRTUAL,
    get() {
        return this.getDataValue('totalCouponDiscount') + this.getDataValue('totalProductDiscount');
      }
  },
  orderTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'order_time'
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  point: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'user_address'
  }
}, {
  tableName: 'orders',
  timestamps: false,
});

module.exports = Order;
