const { koaSequelize } = require("../../config/pluglit");
const { sequelize, DataTypes } = koaSequelize();
const User = require("../models/user.js");
const ChatUserMessage = sequelize.define(
  "ChatUserMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT, // 支持中文字符
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isDeletedBySender: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDeletedByReceiver: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // 可根据需要添加其他消息字段
  },
  {
    tableName: "chatUserMessage",
  }
);

// 关联聊天消息表模型和用户表模型
ChatUserMessage.belongsTo(User, { foreignKey: "senderId", as: "sender" });
ChatUserMessage.belongsTo(User, { foreignKey: "receiverId", as: "receive" });

(async () => {
  await sequelize.sync();
  //如果表不存在则创建该表
})();

module.exports = ChatUserMessage;
