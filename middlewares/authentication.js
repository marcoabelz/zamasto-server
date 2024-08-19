const { verifyToken } = require("../helpers/jwt");

module.exports = async function authentication(req, res, next) {
  try {
    const access_token = req.headers.authorization;
    let [bearer, token] = access_token.split(" ");
    let payload = verifyToken(token);
    if (payload.username === "admin") {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};
