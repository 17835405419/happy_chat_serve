const router = require("koa-router")();

module.exports = (app) => {
  const ctx = app["context"];
  const { register, login, sendEmail, getUserInfo } =
    ctx.controller.user_controller;

  router.post("/register", register);
  router.post("/login", login);
  router.get("/getUserInfo", getUserInfo);
  router.get("/sendEmail", sendEmail);
  return router;
};
