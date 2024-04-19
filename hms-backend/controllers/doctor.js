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

    res.status(201).json({ doctor });
  } catch (error) {
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
