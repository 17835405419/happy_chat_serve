/**
 *
 * @class FriendShipController 好友相关的控制层
 */
const { frinedShip_verify } = require("../verify/friendShip_verify");
class FriendShipController {
  /**
   *
   * @description 添加好友
   * @param {*} ctx
   * @memberof FriendShipController
   */
  async increaseFriend(ctx) {
    const { helper } = ctx.utils;
    const { createFriendShip } = ctx.service.friendShip_service;
    try {
      ctx.verifyParams(frinedShip_verify);
      const friendShipInfo = ctx.request.body;
      const res = await createFriendShip(ctx, friendShipInfo);
      if (res) {
        helper.success(ctx, 2000, "发送好友申请成功");
      }
    } catch (error) {
      const errorMessage = `${error.errors[0].field} ${error.errors[0].message}`;
      helper.throw(ctx, 200, 10001, errorMessage);
    }
  }

  /**
   *
   * @description 获取好友列表
   * @param {*} ctx
   * @memberof FriendShipController
   */
  async getFriendsList(ctx) {
    const { helper } = ctx.utils;
    try {
      const condition = ctx.request.query;

      const { findFriendShip } = ctx.service.friendShip_service;
      const { isOk, project, totalCount } = await findFriendShip(
        ctx,
        condition
        // ["userId1"] //不返回userId1
      );

      if (isOk) {
        helper.success(ctx, 2000, "获取用户列表成功", {
          result: project,
          totalCount,
        });
        return;
      }
      helper.throw(ctx, 200, 20002, "用户列表为空");
    } catch (error) {}
  }

  /**
   *
   * @description 获取关系详情
   * @param {*} ctx
   * @memberof FriendShipController
   */
  async getFriendsInfo(ctx) {
    const { helper } = ctx.utils;
    const { findOneFriendShip } = ctx.service.friendShip_service;
    try {
      const { userId } = ctx.request.params;

      const { isOk, project } = await findOneFriendShip(ctx, userId);
      if (isOk) {
        helper.success(ctx, 2000, "获取用户信息成功", {
          result: project,
        });
        return;
      }
      helper.throw(ctx, 200, 20002, "暂不是好友");
    } catch (error) {}
  }

  /**
   *
   * @description 修改用户关系状态
   * @param {*} ctx
   * @memberof FriendShipController
   */
  async changeFriendShip(ctx) {
    const { helper } = ctx.utils;
    const { updateFriendShip } = ctx.service.friendShip_service;
    try {
      const { userId } = ctx.request.params;
      const data = ctx.request.body;
      const res = await updateFriendShip(ctx, userId, data);
      if (res) helper.success(ctx, 2000, "更新用户关系成功");
    } catch (error) {}
  }

  /**
   *
   * @description 删除用户关系
   * @param {*} ctx
   * @memberof FriendShipController
   */
  async deleteFriendShip(ctx) {
    const { helper } = ctx.utils;
    const { deleteFriendShip } = ctx.service.friendShip_service;
    try {
      const { userId } = ctx.request.params;
      const res = await deleteFriendShip(ctx, userId);
      if (res) helper.success(ctx, 2000, "删除用户成功");
    } catch (error) {}
  }
}
module.exports = new FriendShipController();
