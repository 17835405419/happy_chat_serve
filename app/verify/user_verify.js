const register_verify = {
  username: {
    type: "string",
    required: true,
    allowEmpty: false,
    max: 10,
    min: 10,
  },
  password: {
    type: "string",
    required: true,
    allowEmpty: false,
    min: 8,
    max: 20,
  },
  nickName: {
    type: "string",
    required: true,
    allowEmpty: false,
    min: 3,
    max: 10,
  },
  email: {
    type: "email",
    required: true,
    allowEmpty: false,
  },
  phoneNum: {
    type: "int",
    required: false,
    allowEmpty: false,
    format: /^1[3456789]\d{9}$/,
  },
  desc: {
    type: "string",
    required: false,
    allowEmpty: true,
    min: 0,
    max: 10,
  },
  avatarUrl: {
    type: "url",
    required: false,
    allowEmpty: false,
  },
  status: {
    type: "enum",
    required: false,
    values: ["online", "offline", "away", "busy"],
  },
  lastSeen: {
    type: "date",
    required: false,
    allowEmpty: false,
  },
};

const login_verify = {
  username: {
    type: "string",
    required: true,
    allowEmpty: false,
    max: 10,
    min: 10,
  },
  password: {
    type: "string",
    required: true,
    allowEmpty: false,
    min: 8,
    max: 20,
  },
};
module.exports = {
  register_verify,
  login_verify,
};
