const bcrypt = require("bcrypt");

const hashedPassword = bcrypt.hashSync("admin", 12);

const totalTickets = 20;

module.exports = { hashedPassword, totalTickets };
