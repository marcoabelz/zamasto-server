const { verifyToken } = require("../helpers/jwt");

module.exports = async function authentication(req, res, next) {
  try {
    const access_token = req.headers.authorization;

    // Cek jika access_token ada dan formatnya benar
    if (!access_token || !access_token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Memisahkan 'Bearer' dan token
    let [bearer, token] = access_token.split(" ");

    // Verifikasi token
    let payload = verifyToken(token);

    // Cek jika user adalah admin
    if (payload.username === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
