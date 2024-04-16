const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
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
  },
});

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
