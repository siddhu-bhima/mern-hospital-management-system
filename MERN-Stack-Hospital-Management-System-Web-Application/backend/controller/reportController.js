import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Report } from "../models/reportSchema.js";
import { Appointment } from "../models/appointmentSchema.js";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadReport = catchAsyncErrors(async (req, res, next) => {
  const { appointmentId, reportTitle, reportContent } = req.body;

  if (!appointmentId || !reportTitle || !reportContent) {
    return next(
      new ErrorHandler(
        "Please provide all required fields (appointmentId, reportTitle, reportContent)",
        400
      )
    );
  }

  // Verify appointment exists
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }

  let reportFile = {};

  // Upload file if provided
  if (req.files && req.files.reportFile) {
    const { reportFile: file } = req.files;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "hospital_reports",
    });
    reportFile = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const report = await Report.create({
    appointmentId,
    patientId: appointment.patientId,
    doctorId: appointment.doctorId,
    reportTitle,
    reportContent,
    reportFile,
    uploadedBy: {
      name: `${req.user.firstName} ${req.user.lastName}`,
      role: req.user.role,
    },
  });

  res.status(201).json({
    success: true,
    message: "Report uploaded successfully!",
    report,
  });
});

export const getPatientReports = catchAsyncErrors(async (req, res, next) => {
  const patientId = req.user._id;

  // Get all appointments of this patient
  const appointments = await Appointment.find({ patientId });
  const appointmentIds = appointments.map((apt) => apt._id);

  // Get all reports for these appointments
  const reports = await Report.find({
    appointmentId: { $in: appointmentIds },
  }).populate("appointmentId", "appointment_date department doctor status");

  res.status(200).json({
    success: true,
    reports,
  });
});

export const getDoctorReports = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.user._id;

  // Get all reports uploaded by this doctor
  const reports = await Report.find({ doctorId }).populate(
    "appointmentId",
    "appointment_date department patient status"
  );

  res.status(200).json({
    success: true,
    reports,
  });
});

export const getAppointmentReport = catchAsyncErrors(async (req, res, next) => {
  const { appointmentId } = req.params;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }

  // Check if user is the patient or a doctor/admin
  if (
    appointment.patientId.toString() !== req.user._id.toString() &&
    req.user.role === "Patient"
  ) {
    return next(
      new ErrorHandler("You are not authorized to view this report!", 403)
    );
  }

  const reports = await Report.find({ appointmentId });

  res.status(200).json({
    success: true,
    reports,
  });
});

export const deleteReport = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const report = await Report.findById(id);
  if (!report) {
    return next(new ErrorHandler("Report not found!", 404));
  }

  // Delete from cloudinary if file exists
  if (report.reportFile.public_id) {
    await cloudinary.uploader.destroy(report.reportFile.public_id);
  }

  await report.deleteOne();

  res.status(200).json({
    success: true,
    message: "Report deleted successfully!",
  });
});
