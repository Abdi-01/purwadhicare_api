const jwt = require("jsonwebtoken");
const TOKEN_KEY = process.env.TOKEN_KEY;

module.exports = {
  createToken: (payload) => {
    return jwt.sign(payload, TOKEN_KEY, {
      expiresIn: "12h",
    });
  },
};
