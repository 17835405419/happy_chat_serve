const Koa = require("koa");
const app = new Koa();
require("./core/index.js")(app); //自动挂载目录
const { PORT, HOSTNAME } = require("./config/config.js"); //加载网络配置项
const {
  koaParameter,
  koaRedis,
  koaJwt,
  koaSocket,
} = require("./config/pluglit.js"); //导入插件
const http = require("http");
const server = http.createServer(app.callback()); //创建serve服务 供socket使用

koaSocket(server, app); //使用socket 并挂载至上下文
koaRedis(app); // 初始化并上下文挂载redis 使用 ctx.redis 调用
koaParameter(app); //挂载参数验证函数  之后在上下文中使用 ctx.verifyParams调用
koaJwt(app); //挂载jwt 验证

require("./app/router/index.js")(app); //自动导入路由
app.listen(PORT, HOSTNAME, () => {
  console.log(`serve bagin in http://${HOSTNAME}:${PORT}`);
});
