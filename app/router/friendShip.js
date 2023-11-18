const router = require("koa-router")();

module.exports = (app) => {
  const ctx = app["context"];
  const {
    increaseFriend,
    getFriendsList,
    getFriendsInfo,
    changeFriendShip,
    deleteFriendShip,
  } = ctx.controller.friendShip_controller;

  router.post("/friendShip", increaseFriend);
  router.get("/friendShip", getFriendsList);
  router.get("/friendShip/:userId", getFriendsInfo);
  router.put("/friendShip/:userId", changeFriendShip);
  router.delete("/friendShip/:userId", deleteFriendShip);

  return router;
};
