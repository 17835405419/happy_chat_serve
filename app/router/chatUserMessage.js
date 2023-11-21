const router = require("koa-router")();

module.exports = (app) => {
  const ctx = app["context"];
  const { getChatUserMessage } = ctx.controller.chatUserMessage_controller;

  router.get("/chatUserMessage", getChatUserMessage);
  //   router.get("/friendShip/:userId", getFriendsInfo);
  //   router.put("/friendShip/:userId", changeFriendShip);
  //   router.delete("/friendShip/:userId", deleteFriendShip);

  return router;
};
