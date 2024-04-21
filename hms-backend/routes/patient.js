const express = require("express");
const {
  getPatients,
  createPatient,
  getPatient,
  updatePatient,
  deletePatient,
  getPatientByWardNo,
} = require("../controllers/patient");

const router = express.Router();

router.route("/ward/:wardNo").get(getPatientByWardNo);
router.route("/").get(getPatients).post(createPatient);
router.route("/:id").get(getPatient).put(updatePatient).delete(deletePatient);

module.exports = router;
