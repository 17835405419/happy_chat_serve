/**
 *
 * 根据不同的环境导入不同的配置常量
 *
 */
const path = require("path");

// 获取NODE_ENV环境变量，如果没有设置，默认为'development' 开发环境
const env = process.env.NODE_ENV || "development";

// 构建配置文件路径，假设配置文件名为config.js，存储在configs文件夹中
const configFile = path.resolve(__dirname, "environment", `${env}.js`);

// 加载配置
const config = require(configFile);

module.exports = config;
