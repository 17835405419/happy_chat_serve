/**
 *
 *
 * @class ChatUserMessagecontroller 私聊消息控制层
 */
class ChatUserMessageController {
  async getChatUserMessage(ctx) {
    const { helper } = ctx.utils;
    const { findChatUserMessage } = ctx.service.chatUserMessage_service;
    try {
      const condition = ctx.request.query;
      const { isOk, project, totalCount } = await findChatUserMessage(
        ctx,
        condition
      );
      if (isOk) {
        helper.success(ctx, 3000, "获取消息成功", {
          result: project,
          totalCount,
        });
        return;
      }
      helper.throw(ctx, 200, 30002, "用户列表为空");
    } catch (error) {}
  }
}

module.exports = new ChatUserMessageController();
