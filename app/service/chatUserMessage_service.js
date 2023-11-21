const ChatUserMessage = require("../models/chatUserMessage.js");
const { Op } = require("sequelize");
class ChatUserMessageService {
  async findChatUserMessage(ctx, condition, exclude = []) {
    const { helper, utils } = ctx.utils;
    try {
      let query = {
        [Op.or]: [
          {
            senderId: ctx.state.user.id,
            receiverId: condition.id,
          },
          {
            senderId: condition.id,
            receiverId: ctx.state.user.id,
          },
        ],
      };
      // 分页查询函数
      const { project, totalCount } = await utils.paginate(
        ChatUserMessage,
        query,
        exclude,
        [],
        [["timestamp", "DESC"]],
        condition.page
      );

      if (project.length == 0) {
        return { isOk: false, project, totalCount };
      } else {
        return { isOk: true, project, totalCount };
      }
    } catch (error) {
      console.log(error.message);
      helper.throw(400, 30001, error.message);
    }
  }
}

module.exports = new ChatUserMessageService();
