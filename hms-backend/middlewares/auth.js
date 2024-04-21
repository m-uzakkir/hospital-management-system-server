const jwt = require("jsonwebtoken");

const authenticationMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // throw new Error({ msg: 'No token provided' })
      console.log("No token Provided");
      res.status(500).json({ msg: "User is logged out" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;
    req.user = { id, role };
    next();
  } catch (error) {
    res.status(500).json({ msg: "authentication failed" });
  }
};

module.exports = authenticationMiddleware;
