const { Server } = require("socket.io");
const { koaRedis } = require("../../config/pluglit");
const { verifyToken } = require("../utils/utils");
class SocketManger {
  constructor(server) {
    this.io = new Server(server, { cors: true }).listen(3001);
    this.initConnect();
    this.redis = koaRedis(); //获取redis
  }

  initConnect() {
    this.io.on("connection", async (socket) => {
      const socketId = socket.id; //获取socketId
      const token = socket.handshake.query.token;
      try {
        const { id } = await verifyToken(token);
        // 存入redis
        this.redis.set(`user-${id}-socket`, socketId);

        // 监听连接断开事件
        socket.on("disconnect", () => {
          // 用户连接断开时，从 Redis 中删除对应信息
          this.redis.del(`user-${id}-socket`);
        });
      } catch (error) {}
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
