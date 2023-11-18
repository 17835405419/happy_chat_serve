const frinedShip_verify = {
  userId2: {
    type: "string",
    required: true,
    allowEmpty: false,
  },
  status: {
    type: "enum",
    required: false,
    values: ["pending", "accepted", "rejected", "blocked"],
  },
};

module.exports = {
  frinedShip_verify,
};
