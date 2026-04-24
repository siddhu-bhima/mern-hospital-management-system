import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.ObjectId,
    ref: "Appointment",
    required: [true, "Appointment Id Is Required!"],
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Patient Id Is Required!"],
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Doctor Id Is Required!"],
  },
  reportTitle: {
    type: String,
    required: [true, "Report Title Is Required!"],
  },
  reportContent: {
    type: String,
    required: [true, "Report Content Is Required!"],
  },
  reportFile: {
    public_id: String,
    url: String,
  },
  uploadedBy: {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Doctor", "Admin"],
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Report = mongoose.model("Report", reportSchema);
