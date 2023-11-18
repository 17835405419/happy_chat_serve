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
  CORS: {
    ORIGIN: "*", // 设置允许的 origin，可以是单个字符串或者字符串数组
    METHODS: "GET,HEAD,PUT,PATCH,POST,DELETE", // 允许的 HTTP 方法
  },
};
