const sequelize = require('../config/database');
const { DataTypes, Op } = require('sequelize');

const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
    phone: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    email: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    username: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    rank: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Đồng',
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    birthday: {
      type: DataTypes.DATEONLY,
      defaultValue: null,
    },
    gender: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    image: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    tableName: 'user', 
    timestamps: false, 
    underscored: true, // Sử dụng dấu gạch dưới cho tên cột (id_role -> id_role)
  });
  
  module.exports = User;