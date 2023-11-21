const { Server } = require("socket.io");
const { koaRedis } = require("../../config/pluglit");
const { verifyToken } = require("../utils/utils");
// 获取redis发布订阅
const RedisPubSub = require("./redisPubSub");

class SocketManger {
  constructor(server) {
    this.io = new Server(server, { cors: true }).listen(3001);
    this.initConnect();
    this.redis = koaRedis(); //获取redis

    // 实例化发布订阅模式
    this.redisPubSub = new RedisPubSub();
    this.redisPubSub.subscribePrivate(); //启动订阅
  }

  initConnect() {
    this.io.on("connection", async (socket) => {
      const socketId = socket.id; //获取socketId
      const token = socket.handshake.query.token;
      try {
        const { id: userId } = await verifyToken(token);

        // 存入redis
        this.redis.set(`user-${userId}-socket`, socketId);

        // 私聊功能
        socket.on("privateMessages", async ({ receiverId, content }) => {
          // 发布至频道
          await this.redisPubSub.publishPrivateMessage({
            senderId: userId, //当前登录用户的Id
            receiverId, //接受者id
            content,
          });
          // 根据接收者Id 获取socketId
          const receiveSocketId = await this.redis.get(
            `user-${receiverId}-socket`
          );
          if (receiveSocketId) {
            socket
              .to(receiveSocketId)
              .emit("privateMessages", { senderId: userId, content });
          }
        });

        // 监听连接断开事件
        socket.on("disconnect", () => {
          // 用户连接断开时，从 Redis 中删除对应信息
          this.redis.del(`user-${userId}-socket`);
        });
      } catch (error) {
        // 如果在验证令牌时发生错误，向发送者发送错误消息
        socket.emit("messagesError", {
          errCode: 20001,
          errMessage: error.message,
        });
      }
    });
  }

  // 向某用户发送添加好友事件
  async NotifySomeoneAddFriends(userId) {
    const socketId = await this.redis.get(`user-${userId}-socket`);
    this.io.to(socketId).emit("addFriend", {
      addfriend: true,
    });
  }
}

module.exports = SocketManger;
