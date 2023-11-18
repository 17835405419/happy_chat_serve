const Koa = require("koa");
const app = new Koa();
const http = require("http");
const server = http.createServer(app.callback()); //创建serve服务 供socket使用
require("./core/index.js")(app); //自动挂载目录
const { PORT, HOSTNAME } = require("./config/config.js"); //加载网络配置项
const {
  koaParameter,
  koaRedis,
  koaJwt,
  koaCors,
} = require("./config/pluglit.js"); //导入插件
koaCors(app); //跨域处理

// 获取redis
const redisClient = koaRedis();
app.use(async (ctx, next) => {
  // 将 redis 客户端实例添加到 Koa 的 context 上下文中，使得在路由或其他中间件中可以方便地使用 Redis
  ctx.redis = redisClient;
  await next();
});

koaParameter(app); //挂载参数验证函数  之后在上下文中使用 ctx.verifyParams调用
koaJwt(app); //挂载jwt 验证

// 挂载socket服务
const SocketManger = require("./app/socket/socketManager.js");
const socketManger = new SocketManger(server);
app.use(async (ctx, next) => {
  ctx.socketManger = socketManger;
  await next();
});

require("./app/router/index.js")(app); //自动导入路由
app.listen(PORT, HOSTNAME, () => {
  console.log(`serve bagin in http://${HOSTNAME}:${PORT}`);
});
