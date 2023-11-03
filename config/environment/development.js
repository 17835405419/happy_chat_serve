module.exports = {
  HOSTNAME: "localhost",
  PORT: 3000,
  // mysql配置
  MYSQL: {
    DATABASE: "happy_chat",
    USERNAME: "root",
    PASSWORD: "zwq52000",
  },
  redis: {
    REDISPORT: 6379,
  },
  JWT: {
    SECRET: "my-koa-chat",
    EXPIRESIN: "2h",
  },
  EMAIL: {
    SERVICE: "qq",
    PORT: 465,
    AUTHUSER: "2456491540@qq.com", //邮箱号
    AUTHPASS: "bjftzjuoiepjdiai", //stmp授权码
  },
};
