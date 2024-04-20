const { Team } = require("../models/Team");
const { Doctor } = require("../models/User");

const createTeam = async (req, res) => {
  try {
    const { name, description, doctors } = req.body;

    const team = await Team.create({
      name,
      description,
      doctors,
    });

    res.status(201).json({ team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addDoctorToTheTeam = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const team = await Team.findById(req.params.id);
    const doctor = await Doctor.findById(doctorId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.team = team._id;
    await doctor.save();

    if (team.doctors.includes(doctorId)) {
      return res.status(400).json({ message: "Doctor already in the team" });
    }

    team.doctors.push(doctorId);
    await team.save();

    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeDoctorFromTeam = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const team = await Team.findById(req.params.id);
    const doctor = await Doctor.findById(doctorId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    team.doctors = team.doctors.filter(
      (docId) => docId.toString() !== doctorId
    );
    await team.save();

    doctor.team = null;
    await doctor.save();

    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  addDoctorToTheTeam,
  removeDoctorFromTeam,
};
