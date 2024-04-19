const bcrypt = require("bcrypt");
const { User, Doctor, Patient } = require("../models/User");
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

    // check if user is a doctor or patient

    let token = null;
    let userData = null;

    if (user.role === "doctor") {
      // get the doctor details
      const doctor = await Doctor.findOne({
        user: user._id,
      }).populate("user");

      userData = doctor;

      token = generateToken(
        {
          id: doctor._id,
          role: user.role,
        },
        "1d"
      );
    } else if (user.role === "patient") {
      // get the patient details
      const patient = await Patient.findOne({
        user: user._id,
      }).populate("user");

      userData = patient;

      token = generateToken(
        {
          id: patient._id,
          role: user.role,
        },
        "1d"
      );
    } else {
      token = generateToken(
        {
          id: user._id,
          role: user.role,
        },
        "1d"
      );
    }

    res.status(200).json({ userData, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
};
