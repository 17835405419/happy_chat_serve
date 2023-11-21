// redis发布订阅  用于保存聊天消息

const { koaRedis } = require("../../config/pluglit");
const ChatUserMessage = require("../models/chatUserMessage");

class RedisPubSub {
  constructor() {
    // * 由于ioredis默认为单线程 而发布订阅模式中 发布者订阅者不能为同一redis链接 所以
    this.publisher = koaRedis(); // 发布者连接
    this.subscriber = koaRedis(); // 订阅者连接
    this.subscribePrivateChannel = "privateMessages"; //私聊频道
  }

  async subscribePrivate() {
    // 订阅 Redis 频道
    this.subscriber.subscribe(this.subscribePrivateChannel, (err, count) => {
      if (err) {
        console.error(
          `Error subscribing to Redis channel ${this.subscribePrivateChannel}:`,
          err
        );
      } else {
        console.log(
          `Subscribed to Redis channel ${this.subscribePrivateChannel} with ${count} subscriber(s)`
        );
      }
    });

    // 处理消息
    this.subscriber.on("message", async (channel, message) => {
      if (channel === this.subscribePrivateChannel) {
        const { senderId, receiverId, content } = JSON.parse(message);

        // 将消息保存到数据库
        try {
          await ChatUserMessage.create({
            senderId,
            receiverId,
            content,
          });

          console.log(`Message saved to database: ${content}`);
        } catch (error) {
          console.error("Error saving message to database:", error);
        }
      }
    });
  }

  async publishPrivateMessage({ senderId, receiverId, content }) {
    // 发送消息到 Redis 订阅频道
    try {
      await this.publisher.publish(
        this.subscribePrivateChannel,
        JSON.stringify({ senderId, receiverId, content })
      );
      console.log(`Message sent to Redis Pub/Sub: ${content}`);
    } catch (error) {
      console.error("Error sending message to Redis Pub/Sub:", error);
    }
  }
}

module.exports = RedisPubSub;
