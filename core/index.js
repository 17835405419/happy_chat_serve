//? 将部分目录挂载至上下文中
const fsGlobby = require("fast-glob");
const path = require("path");

/**
 *  @description 仿egg.js自动挂载部分目录
 *
 *  @param {*} app koa app实例用于挂载目录
 */
function koaCore(app) {
  const appPath = path.join(__dirname, "app").replace("\\core", "");

  const context = app["context"];

  const aboutPath = ["controller", "service", "utils"];
  // 完整的文件路径

  aboutPath.forEach((item, index) => {
    let fileAboutPath = {};
    fileAboutPath[item] = path.join(appPath, item);

    // 查找全部js文件
    const files = fsGlobby.sync("**/*.js", {
      cwd: fileAboutPath[item],
    });

    if (item != "middleware") {
      context[item] = {}; // 初始化对象
    }

    files.forEach((file) => {
      const fileName = path.parse(file).name; // 把文件的名字作为key挂载到子对象上
      const content = require(path.join(fileAboutPath[item], file));

      // TODO 由于middleware 和 config 逻辑不同需要在之后做处理

      context[item][fileName] = content; //挂载内容
    });
  });
}

module.exports = koaCore;
