const User = require("../models/user.js");

class UserService {
  async createUser(ctx, userInfo) {
    const { helper } = ctx.utils;
    try {
      // 从redis中获取验证码
      const code = await ctx.redis.get(userInfo.email);
      if (code === userInfo.code) {
        // code存在 调用数据库保存用户注册数据
        await User.create(userInfo);
        return true;
      }
      helper.throw(ctx, 400, 10004, "验证码错误，请重新获取");
    } catch (error) {
      console.log(error);
      helper.throw(ctx, 400, 10003, "用户注册失败");
    }
  }
  async findOneUser(ctx, condition, exclude = []) {
    const { helper } = ctx.utils;
    try {
      let query = {};
      //   id查找
      condition.id &&
        Object.assign(query, {
          id: condition.id,
        });
      //   用户名查找
      condition.username &&
        Object.assign(query, {
          username: condition.username,
        });
      //   邮箱查找
      condition.email &&
        Object.assign(query, {
          email: condition.email,
        });
      //   手机号查找
      condition.phoneNum &&
        Object.assign(query, {
          phoneNum: condition.phoneNum,
        });

      const project = await User.findOne({
        where: query,
        attributes: {
          exclude: exclude, // 排除字段
        },
      });

      if (project === null) {
        helper.throw(ctx, 200, 10005, "用户不存在");
        return { isOk: false, project };
      } else {
        return { isOk: true, project };
      }
    } catch (error) {
      console.log(error);
      helper.throw(400, 10001, error.message);
    }
  }

  async sendEmail(ctx, userEmail) {
    const { helper } = ctx.utils;
    // 调用生成验证码函数
    const { generateCode, sendMailFunc } = ctx.utils.utils;
    try {
      const code = generateCode();
      // 发送邮件
      await sendMailFunc(userEmail, code);
      //   验证码存储至 redis中
      // 使用 ctx.redis.set 设置键值对
      await ctx.redis.set(userEmail, code);
      // 使用 ctx.redis.expire 设置键的过期时间
      await ctx.redis.expire(userEmail, 300);
    } catch (error) {
      helper.throw(ctx, 400, 10001, error.message);
    }
  }
}

module.exports = new UserService();
