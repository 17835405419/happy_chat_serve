// SocketManager.js
const { Server } = require("socket.io");

class SocketManager {
  constructor(server) {
    this.io = new Server(server);
    // this.userSockets = {};
    // this.initSocketEvents();
  }

  initSocketEvents() {
    this.io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      // socket.on("login", (userId) => {
      //   this.userSockets[userId] = socket;
      // });

      // 其他事件处理逻辑...
    });
  }

  // sendMessageToUser(userId, event, data) {
  //   const targetSocket = this.userSockets[userId];
  //   if (targetSocket) {
  //     targetSocket.emit(event, data);
  //     return true; // 消息发送成功
  //   }
  //   return false; // 用户不在线，消息发送失败
  // }
}

module.exports = SocketManager;
