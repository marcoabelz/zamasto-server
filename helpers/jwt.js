const { sign, verify } = require("jsonwebtoken");

module.exports = {
  generateToken: (payload) => sign(payload, process.env.JWT_SECRET),
  verifyToken: (token) => verify(token, process.env.JWT_SECRET),
};
