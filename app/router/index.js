const fs = require("fs");
const path = require("path");
const router = require("koa-router")(); //创建实例化router
const { koaBodyParser } = require("../../config/pluglit");

// 记录路由请求日志并输出
async function routerLog(ctx, next) {
  // 打印请求方法和路径
  console.log(`${"-".repeat(35)}`);

  console.log(`[${ctx.method}] ->  ${ctx.path}`);
  // 调用下一个中间件
  await next();
}

module.exports = (app) => {
  koaBodyParser(app); // ! 解析body参数  需要放置于路由之前
  const files = fs.readdirSync(__dirname);
  // 遍历文件
  files.forEach((file) => {
    if (file !== "index.js") {
      const fileRouter = require(path.join(__dirname, file))(app);
      router.use(routerLog, fileRouter.routes());
    }
  });
  app.use(router.routes(), router.allowedMethods());
};
