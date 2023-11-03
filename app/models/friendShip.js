"use strict";
const { koaSequelize } = require("../../config/pluglit");
const { sequelize, DataTypes } = koaSequelize();
const FriendShip = sequelize.define(
  "FriendShip",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "blocked"), // 待定 已接受 被拒绝 被拉黑
      allowNull: false,
      defaultValue: "pending",
    },
    UserID1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserID2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "friendShip",
  }
);
(async () => {
  await sequelize.sync();
  //如果表不存在则创建该表
})();

module.exports = FriendShip;
