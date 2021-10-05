const jwt = require("jsonwebtoken");
const TOKEN_KEY = process.env.TOKEN_KEY;

module.exports = {
  auth: (req, res, next) => {
    jwt.verify(req.token, TOKEN_KEY, (err, decode) => {
      if (err) {
        return res.status(401).send("User not auth");
      }
      req.user = decode;
    });
    next();
  },
};
