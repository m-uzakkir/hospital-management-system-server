const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { generateToken } = require("../services/token");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const token = generateToken(
      {
        id: user._id,
        role: user.role,
      },
      "1d"
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
};
