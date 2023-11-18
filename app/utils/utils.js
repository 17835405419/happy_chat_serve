/**
 *
 *
 * @class Utils 工具类 抽离出功能性函数 用于额外的功能
 */
const {
  uuid,
  koaJsonwebtoken,
  koaTransporter,
  koaBcrypt,
} = require("../../config/pluglit");
const { JWT } = require("../../config/config");
class Utils {
  /**
   *
   * @return {*code} 返回的邮箱验证码
   * @memberof Utils
   */
  generateCode() {
    const code = uuid().split("-")[0].slice(0, 5);
    return code;
  }

  /**
   *
   *
   * @param {*} user 加密的部分用户信息 用于之后使用
   * @return {*} 返回token
   * @memberof Utils
   */
  generateToken(user) {
    const jwt = koaJsonwebtoken();
    const token = jwt.sign(user, JWT.SECRET, { expiresIn: JWT.EXPIRESIN });
    return token;
  }

  verifyToken(token) {
    const jwt = koaJsonwebtoken();
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT.SECRET, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  /**
   *
   *
   * @param {*} userEmail 接受者邮箱
   * @param {*} content  发送的code内容
   * @return {*} 返回发送结果
   * @memberof Utils
   */
  sendMailFunc(userEmail, content) {
    // 获取transporter实例
    const transporter = koaTransporter();
    // 创建邮件详情
    let mailOptions = {
      from: "IM <2456491540@qq.com>",
      to: userEmail,
      subject: "IM验证码",
      html: `<h1>IM系统邮箱验证码:</h1><p>请保管好您的验证码，该验证码五分钟内有效: \n </p> \t<strong> ${content}</strong>`,
    };
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }

  async hashPassword(password) {
    const saltRounds = 10; // 加密强度，可以根据需要调整
    const bcrypt = koaBcrypt();
    return await bcrypt.hash(password, saltRounds);
  }
  async hashCompare(params1, params2) {
    const bcrypt = koaBcrypt();
    return await bcrypt.compare(params1, params2);
  }

  /**
   *
   *
   * @param {*} model 数据库模型
   * @param {*} query 查询条件
   * @param {*} [exclude=[]]
   * @param {number} [page=1]
   * @param {number} [pageSize=10]
   * @return {*}
   * @memberof Utils
   */
  async paginate(
    model,
    query,
    exclude = [],
    include = [],
    page = 1,
    pageSize = 10
  ) {
    // 计算偏移量
    const offset = (page - 1) * pageSize;
    const data = await model.findAll({
      where: query,
      attributes: {
        exclude: exclude,
      },
      include: include, //连表选项
      offset: offset,
      limit: pageSize,
    });
    // 处理数据
    const res = data.map((element) => {
      return element.dataValues;
    });

    const totalCount = await model.count({ where: query });

    return { project: res, totalCount: totalCount };
  }
}

module.exports = new Utils();
