const mongoose = require("mongoose");
const { Department } = require("../models/Department");
const { Doctor } = require("../models/User");

const createDepartment = async (req, res) => {
  try {
    const { name, description, doctors } = req.body;

    const department = await Department.create({
      name,
      description,
      doctors,
    });

    res.status(201).json({ department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDepartments = async (req, res) => {
  try {
    const department = await Department.find();
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addDoctorToTheDepartment = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const department = await Department.findById(req.params.id);
    const doctor = await Doctor.findById(doctorId);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.department = department._id;
    await doctor.save();

    // add if not already added
    if (department.doctors.includes(doctorId)) {
      return res.status(200).json({ department });
    }
    department.doctors.push(doctorId);
    await department.save();

    res.status(200).json({ department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeDoctorFromDepartment = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const department = await Department.findById(req.params.id);
    const doctor = await Doctor.findById(doctorId);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    department.doctors = department.doctors.filter(
      (docId) => docId.toString() !== doctorId
    );
    await department.save();

    doctor.department = null;
    await doctor.save();

    res.status(200).json({ department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  addDoctorToTheDepartment,
  removeDoctorFromDepartment,
};
