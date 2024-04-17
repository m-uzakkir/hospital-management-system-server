const { Doctor, User } = require("../models/User");
const { generateToken } = require("../services/token");
const bcrypt = require("bcrypt");

// Create a new doctor

const createDoctor = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    let user = await User.findOne({
      email,
    });

    if (!user) {
      user = await User.create({
        email,
        hashedPassword,
        role: "doctor",
      });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }

    const doctor = await Doctor.create({
      user: user._id,
      name,
    });

    const token = generateToken(
      {
        id: doctor._id,
        role: user.role,
      },
      "1d"
    );

    res.status(201).json({ doctor, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
};
