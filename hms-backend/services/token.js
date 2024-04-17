const jwt = require("jsonwebtoken");

const getToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

const generateToken = (info, expiry) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is undefined.", 500);
  }
  return jwt.sign(info, secret, { expiresIn: expiry });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is undefined.");
  }
  if (tokenBlacklist.has(token)) {
    throw new Error("User is logged out!", 401);
  }

  return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken, getToken };
