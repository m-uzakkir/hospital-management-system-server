const express = require("express");

const router = express.Router();

const {
  getTeams,
  createTeam,
  getTeam,
  updateTeam,
  deleteTeam,
  addDoctorToTheTeam,
  removeDoctorFromTeam,
} = require("../controllers/team");

router.route("/").post(createTeam).get(getTeams);
router
  .route("/:id")
  .get(getTeam)
  .put(updateTeam) // use update team to assign multiple doctors to the team
  .delete(deleteTeam)
  .post(addDoctorToTheTeam);

router.route("/:id/remove-doctor").delete(removeDoctorFromTeam);

module.exports = router;
