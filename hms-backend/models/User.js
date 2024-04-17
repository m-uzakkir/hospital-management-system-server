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

  age: {
    type: Number,
  },

  wardNo: {
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

  age: {
    type: Number,
  },

  department: {
    type: String,
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
