/**
 *
 *
 * @class Helper 帮助类 抽取一些公共函数 方法
 */

class Helper {
  /**
   * @param {*} ctx koa上下文
   * @param {*} code 成功code码
   * @param {*} codeMessage 成功的返回信息
   * @param {*} args 剩余参数 额外的数据返回
   * @memberof Helper
   */
  success(ctx, code, codeMessage, args = {}) {
    ctx.response.status = 200;
    ctx.body = {
      code,
      codeMessage,
      ...args,
    };
  }

  /**
   * @param {*} ctx koa 上下文
   * @param {*} status 状态码
   * @param {*} errCode 错误的code码
   * @param {*} errMessage 错误的返回信息
   * @memberof Helper
   */
  throw(ctx, status, errCode, errMessage) {
    ctx.response.status = status;
    ctx.body = {
      errCode,
      errMessage,
    };
  }
}

module.exports = new Helper();
