const sequelize = require('../config/database');
const { DataTypes, Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
  phone: {
    type: DataTypes.TEXT,
    defaultValue: null,
    unique: true,
    validate: {
      isVNPhoneNumber(value) {
        if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(value)) {
          throw new Error('Invalid phone number format');
        }
      }
    }
  },
  email: {
    type: DataTypes.TEXT,
    defaultValue: null,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    defaultValue: null,
    unique: true,
    validate: {
      notEmpty: true,
      len: [6, 100]
    }
  },
  confirmPassword: {
    type: DataTypes.VIRTUAL,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 100],
      isMatching(value) {
        if (value !== this.password) {
          throw new Error('Passwords do not match!');
        }
      }
    }
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
    defaultValue: 1,
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
  passwordChangedAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'user',
  timestamps: false,
  defaultScope: {
    // Các truy vấn mặc định sẽ không lấy trường password
    attributes: { exclude: ['password', 'status'] }
  },
  scopes: {
    // Tạo một scope để lấy trường password khi cần thiết
    withPassword: {
      attributes: { include: ['password'] }
    }
  }
});

// hook
User.beforeCreate(async (user, options) => {
  if (!user.changed('password')) {
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.passwordChangedAt = new Date(Date.now() - 1000);
  } catch (err) {
    throw err;
  }
});


User.prototype.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw new Error(err);
  }
};


User.prototype.isPasswordChanged = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const pswdChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    //console.log(pswdChangedTimestamp, JWTTimestamp)
    return JWTTimestamp < pswdChangedTimestamp;
  }
  return false;
}

module.exports = User;