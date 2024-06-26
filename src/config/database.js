require('dotenv').config();
const { Sequelize, Op } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, null, {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,       // Số lượng kết nối tối đa trong pool
    min: 0,       // Số lượng kết nối tối thiểu trong pool
    acquire: 30000, // Thời gian (ms) để cố gắng kết nối trước khi phát sinh lỗi
    idle: 10000   // Thời gian (ms) một kết nối có thể idle trước khi bị đóng
  }
});

module.exports = sequelize;