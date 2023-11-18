const router = require("koa-router")();

module.exports = (app) => {
  const ctx = app["context"];
  const { register, login, sendEmail, getUserInfo, getOneUserInfo } =
    ctx.controller.user_controller;

  router.post("/register", register);
  router.post("/login", login);
  router.get("/getLoginUserInfo", getUserInfo);
  router.get("/getUserInfo", getOneUserInfo);
  router.get("/sendEmail", sendEmail);
  return router;
};
