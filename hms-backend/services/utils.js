const bcrypt = require("bcrypt");

const hashedPassword = bcrypt.hashSync("admin", 12);

module.exports = { hashedPassword };
