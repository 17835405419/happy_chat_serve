"use strict";
const { koaSequelize } = require("../../config/pluglit");
const Friendship = require("../models/friendShip");
const { sequelize, Model, DataTypes } = koaSequelize();
const { hashPassword } = require("../utils/utils.js");
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING(10),
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    nickName: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    email: {
      unique: true,
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    phoneNum: {
      unique: true,
      type: DataTypes.INTEGER(11),
      validate: {
        isNumeric: true,
      },
    },
    desc: DataTypes.STRING(30),
    avatarUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    status: {
      type: DataTypes.ENUM("online", "offline", "away", "busy"),
      defaultValue: "offline", // 设置默认值
    },
    lastSeen: {
      type: DataTypes.DATE,
      defaultValue: Date.now,
    },
  },
  {
    tableName: "user",
  }
);

// 好友关系关联
User.belongsToMany(User, {
  through: Friendship,
  as: "Friends",
  foreignKey: "UserID1",
  otherKey: "UserID2",
});

(async () => {
  await sequelize.sync();
  //如果表不存在则创建该表
})();

// 钩子函数 创建前加密存储用户的密码
User.addHook("beforeCreate", async (user, options) => {
  user.password = await hashPassword(user.password);
});

module.exports = User;
