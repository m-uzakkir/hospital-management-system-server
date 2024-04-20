const express = require("express");

const router = express.Router();

const {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  addDoctorToTheDepartment,
  removeDoctorFromDepartment,
} = require("../controllers/department");

router.route("/").post(createDepartment).get(getDepartments);
router
  .route("/:id")
  .get(getDepartment)
  .put(updateDepartment) // use update team to assign multiple doctors to the team
  .delete(deleteDepartment)
  .post(addDoctorToTheDepartment);

router.route("/:id/remove-doctor").delete(removeDoctorFromDepartment);

module.exports = router;
