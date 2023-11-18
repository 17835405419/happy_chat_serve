"use strict";

/**
 *
 *  @type {*} 用户ID与socketID关联表
 *
 *
 *  */
const { koaSequelize } = require("../../config/pluglit");
const { sequelize, DataTypes } = koaSequelize();
const User = require("./user.js");
const UserSocket = sequelize.define(
  "UserSocket",
  {
    userId: {
      type: DataTypes.UUID,
      unique: true,
    },
    socketId: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "userSocket",
  }
);

// 将user表 与该表进行关联
UserSocket.belongsTo(User, { foreignKey: "userId" });

(async () => {
  await sequelize.sync();
  //如果表不存在则创建该表
})();

module.exports = UserSocket;
