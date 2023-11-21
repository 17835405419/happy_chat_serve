const FriendShip = require("../models/friendShip.js");
const User = require("../models/user.js");
const { Op } = require("sequelize");
class FriendShipService {
  async createFriendShip(ctx, friendShipInfo) {
    const { helper } = ctx.utils;
    try {
      // ctx.state.user.id 登录者的id jwt自动挂载
      Object.assign(friendShipInfo, { userId1: ctx.state.user.id });
      const data = await FriendShip.create(friendShipInfo);
      // 创建之后调用 socket发送 通知信息
      ctx.socketManger.NotifySomeoneAddFriends(friendShipInfo.userId2);
      return true;
    } catch (error) {
      // console.log(error);
      helper.throw(ctx, 200, 20001, error.message);
    }
  }

  /**
   *
   * @description 查询用户关系列表
   * @param {*} ctx
   * @param {*} condition 查询的条件
   * @param {*} [exclude=[]] 不返回那些字段
   * @return {*}
   * @memberof FriendShipService
   */
  async findFriendShip(ctx, condition, exclude = []) {
    const { helper, utils } = ctx.utils;
    try {
      let query = {
        [Op.or]: [
          {
            userId1: ctx.state.user.id,
          },
          {
            userId2: ctx.state.user.id,
          },
        ],
      };
      condition.username &&
        Object.assign(query, {
          username: condition.username,
        });
      condition.status &&
        Object.assign(query, {
          status: condition.status,
        });

      const include = [
        {
          model: User,
          as: "beRequest_friendShipInfo",
          attributes: ["id", "username", "nickName", "avatarUrl"], //控制该表的返回数据
        },
        {
          model: User,
          as: "request_friendShipInfo",
          attributes: ["id", "username", "nickName", "avatarUrl"], //控制该表的返回数据
        },
      ];

      // 分页查询函数
      const { project, totalCount } = await utils.paginate(
        FriendShip,
        query,
        exclude,
        include,
        [],
        condition.page
      );

      if (project.length == 0) {
        return { isOk: false, project, totalCount };
      } else {
        return { isOk: true, project, totalCount };
      }
    } catch (error) {
      console.log(error.message);
      helper.throw(400, 20001, error.message);
    }
  }

  async findOneFriendShip(ctx, userId, exclude = []) {
    const { helper } = ctx.utils;
    try {
      // 由于 当前登录用户可能为邀请方也可能为被邀请方
      const project = await FriendShip.findOne({
        where: {
          [Op.or]: [
            {
              userId1: ctx.state.user.id,
              userId2: userId,
            },
            {
              userId1: userId,
              userId2: ctx.state.user.id,
            },
          ],
        },
        attributes: {
          exclude: exclude, // 排除字段
        },
        // 联表查询  暂不需要
        // include: [
        //   {
        //     model: User,
        //     as: "friendShipInfo", // 别名，表示 FriendShip 中的 userId1 对应的 User 表
        //     attributes: {
        //       exclude: ["password"], //控制该表的返回数据
        //     },
        //   },
        // ],
      });

      if (project === null) {
        helper.throw(ctx, 200, 20004, "对方不是您的好友");
        return { isOk: false, project };
      } else {
        return { isOk: true, project };
      }
    } catch (error) {
      console.log(error.message);
      helper.throw(ctx, 400, 20001, error.message);
    }
  }

  /**
   *
   * @description 更新用户关系表数据 状态
   * @param {*} ctx koa上下文
   * @param {*} data  要更新的数据
   * @memberof FriendShipService
   */
  async updateFriendShip(ctx, userId, data) {
    const { helper } = ctx.utils;
    try {
      const [updatedRowCount] = await FriendShip.update(
        { status: data.status },
        {
          where: {
            [Op.or]: [
              {
                userId1: ctx.state.user.id,
                userId2: userId,
              },
              {
                userId1: userId,
                userId2: ctx.state.user.id,
              },
            ],
          },
        }
      );
      if (updatedRowCount > 0) {
        return true;
      } else {
        helper.throw(ctx, 200, 20003, "关系未发生改变");
        return;
      }
    } catch (error) {
      console.log(error);
      helper.throw(ctx, 400, 20001, error.message);
    }
  }

  async deleteFriendShip(ctx, userId) {
    const { helper } = ctx.utils;
    try {
      const { deletedRows } = await FriendShip.destroy({
        where: {
          userId1: ctx.state.user.id,
          userId2: userId,
        },
      });
      if (deletedRows > 0) {
        return true;
      } else {
        helper.throw(ctx, 200, 20004, "删除关系失败");
      }
    } catch (error) {
      console.log(error);
      helper.throw(ctx, 400, 20001, error.message);
    }
  }
}

module.exports = new FriendShipService();
