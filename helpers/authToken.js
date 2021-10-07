const jwt = require("jsonwebtoken");
const TOKEN_KEY = process.env.TOKEN_KEY;

// Token Untuk Proses Authentication
module.exports = {
  auth: (req, res, next) => {
    jwt.verify(req.token, TOKEN_KEY, (err, decode) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      req.user = decode;
    });
    next();
  },
};
