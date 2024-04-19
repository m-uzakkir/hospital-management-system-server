const express = require("express");
const {
  getDoctors,
  createDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctor");

const router = express.Router();

router.route("/").get(getDoctors).post(createDoctor);
router.route("/:id").get(getDoctor).put(updateDoctor).delete(deleteDoctor);

module.exports = router;
