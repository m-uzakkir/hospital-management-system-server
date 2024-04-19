const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  hashedPassword: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    enum: ["admin", "doctor", "patient"],
  },
});

const PatientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  patientID: {
    type: String,
    // required: true,
  },

  mobileNo: {
    type: String,
  },

  fatherName: {
    type: String,
  },

  mothersName: {
    type: String,
  },

  spouseName: {
    type: String,
  },

  city: {
    type: String,
  },

  area: {
    type: String,
  },

  post: {
    type: String,
  },

  wardNo: {
    type: String,
  },

  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },

  presentAddress: {
    type: String,
  },

  status: {
    type: String,
    // give a default value
    default: "admitted",
  },
});

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  doctorID: {
    type: String,
    // required: true,
  },

  fatherName: {
    type: String,
  },

  mothersName: {
    type: String,
  },

  spouseName: {
    type: String,
  },

  city: {
    type: String,
  },

  area: {
    type: String,
  },

  post: {
    type: String,
  },

  presentAddress: {
    type: String,
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
});

const User = mongoose.model("User", UserSchema);
const Patient = mongoose.model("Patient", PatientSchema);
const Doctor = mongoose.model("Doctor", DoctorSchema);

module.exports = {
  User,
  Patient,
  Doctor,
};
