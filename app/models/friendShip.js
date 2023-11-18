"use strict";
const { koaSequelize } = require("../../config/pluglit");
const { sequelize, DataTypes } = koaSequelize();
const { Op } = require("sequelize");
const User = require("../models/user.js");
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
    userId1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "friendShip",
  }
);

FriendShip.belongsTo(User, {
  foreignKey: "userId2", // FriendShip模型中关联的外键
  targetKey: "id",
  as: "beRequest_friendShipInfo", //被请求者的信息
});

FriendShip.belongsTo(User, {
  foreignKey: "userId1", // FriendShip模型中关联的外键
  targetKey: "id",
  as: "request_friendShipInfo", //请求者的信息
});

(async () => {
  await sequelize.sync();
  //如果表不存在则创建该表
})();

// 钩子函数 判断该条数据是否已经存在
FriendShip.addHook("beforeCreate", async (friendShip, options) => {
  const existingFriendship = await FriendShip.findOne({
    where: {
      [Op.or]: [
        {
          userId1: friendShip.userId1,
          userId2: friendShip.userId2,
        },
        {
          userId1: friendShip.userId2,
          userId2: friendShip.userId1,
        },
      ],
    },
  });
  if (existingFriendship) {
    if (existingFriendship.dataValues.status === "pending") {
      throw new Error("您已发送申请，请勿重复发送");
    } else if (existingFriendship.dataValues.status == "rejected") {
      // 删除该数据
      await FriendShip.destroy({
        where: {
          [Op.or]: [
            {
              userId1: friendShip.userId1,
              userId2: friendShip.userId2,
            },
            {
              userId1: friendShip.userId2,
              userId2: friendShip.userId1,
            },
          ],
        },
      });
    } else if (existingFriendship.dataValues.status == "accepted") {
      throw new Error("您已经是对方好友");
    } else {
      throw new Error("您已被拉黑");
    }
  }
});

module.exports = FriendShip;
