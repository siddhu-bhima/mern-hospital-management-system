import express from "express";
import {
  uploadReport,
  getPatientReports,
  getAppointmentReport,
  deleteReport,
  getDoctorReports,
} from "../controller/reportController.js";
import {
  isPatientAuthenticated,
  isDoctorOrAdminAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

// Patient can view their reports
router.get("/patient/my-reports", isPatientAuthenticated, getPatientReports);

// Doctor can view their uploaded reports
router.get("/doctor/my-reports", isDoctorOrAdminAuthenticated, getDoctorReports);

// Get reports for specific appointment
router.get(
  "/appointment/:appointmentId",
  isPatientAuthenticated,
  getAppointmentReport
);

// Doctor/Admin can upload reports
router.post("/upload", isDoctorOrAdminAuthenticated, uploadReport);

// Doctor/Admin can delete reports
router.delete("/delete/:id", isDoctorOrAdminAuthenticated, deleteReport);

export default router;
