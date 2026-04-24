import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
  getPatientAppointments,
  getDoctorAppointments,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
  isDoctorOrAdminAuthenticated,
  isDoctorAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.get("/patient/my-appointments", isPatientAuthenticated, getPatientAppointments);
router.get("/doctor/my-appointments", isDoctorAuthenticated, getDoctorAppointments);
router.put("/update/:id", isDoctorOrAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

export default router;
