const { Team } = require("../models/Team");
const { Doctor, User } = require("../models/User");
const { generateToken } = require("../services/token");
const bcrypt = require("bcrypt");

// Create a new doctor

const createDoctor = async (req, res) => {
  let user;
  try {
    const { email, password, name, ...payload } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    user = await User.findOne({
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
      ...payload,
    });

    if (doctor.team) {
      const updateTeam = await Team.findByIdAndUpdate(doctor.team, {
        $push: { doctors: doctor._id },
      });

      if (!updateTeam) {
        return res.status(400).json({ message: "Team does not exist" });
      }
    }

    res.status(201).json({ doctor });
  } catch (error) {
    if (user) {
      await User.findByIdAndDelete(user._id);
    }

    res.status(500).json({ error: error.message });
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user");
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("user");
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (doctor.team) {
      const updateTeam = await Team.findByIdAndUpdate(doctor.team, {
        $push: { doctors: doctor._id },
      });

      if (!updateTeam) {
        return res.status(400).json({ message: "Team does not exist" });
      }
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
};
