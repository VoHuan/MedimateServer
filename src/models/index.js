const sequelize = require('../config/database');
const Product = require('./Product');
const Unit = require('./Unit');
const User = require('./User');
const Cart = require('./Cart');
const Token = require('./Token');

// Product Associations
Product.belongsTo(Unit, {
    foreignKey: 'id_unit',
    as: 'unit',
});

Product.hasOne(Cart, {
    foreignKey: 'id_product',
});

// Unit Associations
Unit.hasOne(Product, {
    foreignKey: 'id',
    as: 'product',
});

// User Associations
User.hasMany(Cart, {
    foreignKey: 'id_user',
    onDelete: 'CASCADE', // Xoá các cart item liên quan nếu user bị xoá
});

// Cart Associations
Cart.belongsTo(User, {
    foreignKey: 'id_user',
    onDelete: 'CASCADE', // Xoá các cart item liên quan nếu user bị xoá
});

Cart.belongsTo(Product, {
    foreignKey: 'id_product',
});

// Token Associations
Token.belongsTo(User, {
    foreignKey: 'id_user',
    onDelete: 'CASCADE' // Nếu user bị xóa, token liên quan cũng sẽ bị xóa
  });

module.exports = {
    Product,
    Unit,
    User,
    Cart,
    Token,
};