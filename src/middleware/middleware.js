const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  return token
    ? jwt.verify(token.split(" ")[1], process.env.SECRET_KEY, (err, user) =>
        err
          ? res.status(403).json({ error: "Forbidden - Invalid token" })
          : ((req.user = user), next())
      )
    : res.status(401).json({ error: "Unauthorized - Token not provided" });
};

module.exports = authenticateToken;
