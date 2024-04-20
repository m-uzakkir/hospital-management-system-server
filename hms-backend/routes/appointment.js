const express = require("express");
const {
  getAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getAvailableTicketsForDoctor,
} = require("../controllers/appointment");

const router = express.Router();

router
  .route("/get-available-tickets/:doctorId")
  .get(getAvailableTicketsForDoctor);

router.route("/").get(getAppointments).post(createAppointment);
router
  .route("/:id")
  .get(getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment);

module.exports = router;
