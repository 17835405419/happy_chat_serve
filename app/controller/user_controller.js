/**
 *
 *
 * @class UserController 用户相关的控制层
 */
const { register_verify, login_verify } = require("../verify/user_verify");

class UserController {
  /**
   *
   * @description 注册方法
   * @param {*} ctx koa上下文
   * @memberof UserController
   */
  async register(ctx) {
    const { helper } = ctx.utils;
    const { createUser } = ctx.service.user_service;
    try {
      ctx.verifyParams(register_verify);
      const userInfo = ctx.request.body;
      const res = await createUser(ctx, userInfo);
      if (res) helper.success(ctx, 1000, "用户注册成功");
    } catch (error) {
      const errorMessage = `${error.errors[0].field} ${error.errors[0].message}`;
      helper.throw(ctx, 200, 10001, errorMessage);
    }
  }

  /**
   *
   * @description 登录方法
   * @param {*} ctx
   * @memberof UserController
   */
  async login(ctx) {
    const { helper, utils } = ctx.utils;
    const { findOneUser } = ctx.service.user_service;

    try {
      ctx.verifyParams(login_verify);
      const loginInfo = ctx.request.body;
      const { isOk, project } = await findOneUser(ctx, loginInfo);

      if (isOk) {
        //通过bcrypt.compare 比较加密的密码和数据库中的密码是否相同
        const isTrue = await utils.hashCompare(
          loginInfo.password,
          project.password
        );

        if (isTrue) {
          const token = utils.generateToken({
            id: project.id,
            username: project.username,
          });
          return helper.success(ctx, 1000, "登录成功", { token: token });
        }
        helper.throw(ctx, 200, 10007, "用户密码错误");
      }
    } catch (error) {
      // 处理参数验证错误

      const errorMessage = `${error.errors[0].field} ${error.errors[0].message}`;
      helper.throw(ctx, 200, 10001, errorMessage);
    }
  }

  /**
   *
   * @description 发送验证码方法
   * @param {*} ctx
   * @memberof UserController
   */
  async sendEmail(ctx) {
    const { helper } = ctx.utils;
    const { sendEmail } = ctx.service.user_service;
    try {
      ctx.verifyParams({
        userEmail: {
          type: "email",
          required: true,
        },
      });
      const { userEmail } = ctx.request.query;
      await sendEmail(ctx, userEmail);
      helper.success(ctx, 1000, "验证码发送成功");
    } catch (error) {
      const errorMessage = `${error.errors[0].field} ${error.errors[0].message}`;
      helper.throw(ctx, 200, 10001, errorMessage);
    }
  }

  /**
   *
   * @description 获取登录用户信息
   * @param {*} ctx
   * @memberof UserController
   */
  async getUserInfo(ctx) {
    const { helper } = ctx.utils;
    const { findOneUser } = ctx.service.user_service;
    try {
      // 验证完token 从state中解析出加密数据
      const { id } = ctx.state.user;
      // 通过id查找用户
      const { isOk, project } = await findOneUser(ctx, { id }, ["password"]);
      if (isOk) {
        helper.success(ctx, 1000, "获取用户信息成功", {
          result: project.dataValues,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getOneUserInfo(ctx) {
    const { helper } = ctx.utils;
    const { findOneUser } = ctx.service.user_service;

    try {
      const condition = ctx.request.query;
      console.log(condition);
      const { isOk, project } = await findOneUser(ctx, condition, ["password"]);
      if (isOk) {
        helper.success(ctx, 1000, "获取用户信息成功", {
          result: project.dataValues,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UserController();
