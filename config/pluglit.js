/**
 * 插件的开启及配置
 *
 */
const { HOSTNAME, MYSQL, redis, JWT, EMAIL, CORS } = require("./config");
const bodyParser = require("koa-bodyparser");
const parameter = require("koa-parameter");
const Redis = require("ioredis");
const { v4: uuidv4 } = require("uuid");
const jwt = require("koa-jwt");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Sequelize, Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const cors = require("koa2-cors");

// ! 因为使用了sequelize-cli 暂时不需要这样手动连接了
// const dbConnect = async () => {
//   const sequelize = new Sequelize(
//     MYSQL.DATABASE,
//     MYSQL.USERNAME,
//     MYSQL.PASSWORD,
//     {
//       host: HOSTNAME,
//       dialect: "mysql",
//       define: {
//         // 模型定义的默认选项
//         timestamps: false,
//       },
//     }
//   );
//   // 测试数据库连接
//   try {
//     await sequelize.authenticate();
//     console.log("-".repeat(35));
//     console.log("Connection has been established successfully.");
//     return sequelize; //返回sequelize实例
//   } catch (error) {
//     console.log("-".repeat(35));
//     console.error("Unable to connect to the database:", error);
//   }
// };
const koaBodyParser = (app) => {
  app.use(bodyParser());
};
// 验证参数
const koaParameter = (app) => {
  return parameter(app);
};
// sequelize的使用
const koaSequelize = () => {
  const sequelize = new Sequelize(
    MYSQL.DATABASE,
    MYSQL.USERNAME,
    MYSQL.PASSWORD,
    {
      host: HOSTNAME,
      dialect: "mysql",
      logging: false, // 禁止输出查询日志
    }
  );
  return { sequelize, Model, DataTypes };
};
// redies的使用
const koaRedis = () => {
  const redisClient = new Redis({
    host: "localhost", // Redis 服务器的主机名
    port: redis.REDISPORT, // Redis 服务器的端口号
    db: 0,
  });
  return redisClient;
};

// uuid 的使用
const uuid = () => uuidv4();
// bcrypt的使用
const koaBcrypt = () => bcrypt;
// koa-jwt的使用
const koaJwt = (app) => {
  app.use(
    jwt({ secret: JWT.SECRET }).unless({
      path: ["/login", "/register", "/sendEmail"],
    })
  );
};
// token生成插件
const koaJsonwebtoken = () => {
  return jsonwebtoken;
};

// 发送邮件插件
const koaTransporter = () => {
  // 创建nodemailer实例
  const transporter = nodemailer.createTransport({
    service: EMAIL.SERVICE, //类型qq邮箱
    port: EMAIL.PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: EMAIL.AUTHUSER, // 发送方的邮箱
      pass: EMAIL.AUTHPASS, // smtp 的授权码
    },
  });
  return transporter;
};

// 跨域处理
const koaCors = (app) => {
  app.use(
    cors({
      origin: CORS.ORIGIN,
      methods: CORS.METHODS,
    })
  );
};

const ceshi = () => 123;
module.exports = {
  //! dbConnect,
  ceshi,
  koaBodyParser,
  koaParameter,
  koaSequelize,
  koaRedis,
  koaBcrypt,
  uuid,
  koaJwt,
  koaJsonwebtoken,
  koaTransporter,
  koaCors,
};
