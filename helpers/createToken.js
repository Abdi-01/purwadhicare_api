const jwt = require("jsonwebtoken");
const TOKEN_KEY = process.env.TOKEN_KEY;

// Membuat Token dengan JWT
module.exports = {
  createToken: (payload) => {
    return jwt.sign(payload, TOKEN_KEY, {
      expiresIn: "24h",
    });
  },
};
