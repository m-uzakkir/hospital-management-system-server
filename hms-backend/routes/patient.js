const express = require("express");
const { getPatients, createPatient } = require("../controllers/patient");

const router = express.Router();

router.route("/").get(getPatients).post(createPatient);

module.exports = router;
