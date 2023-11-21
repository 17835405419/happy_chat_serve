"use strict";
const { koaSequelize } = require("../../config/pluglit");
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
      // TODO 为了测试数据 现改为不唯一之后再改
      // unique: true,
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
      type: DataTypes.TEXT,
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

(async () => {
  await sequelize.sync();
  //如果表不存在则创建该表
})();

// 钩子函数 创建前加密存储用户的密码
User.addHook("beforeCreate", async (user, options) => {
  user.password = await hashPassword(user.password);
});

module.exports = User;
