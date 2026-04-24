import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./MyAppointments.css";
import.meta.env.VITE_BACKEND_URL;
const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [reportForm, setReportForm] = useState({
    appointmentId: null,
    reportTitle: "",
    reportContent: "",
  });
  const [showReportForm, setShowReportForm] = useState(null);
  const [uploadingReport, setUploadingReport] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState({});

  const { isAuthenticated, user } = useContext(Context);

  useEffect(() => {
    const fetchAppointmentsAndReports = async () => {
      try {
        setLoading(true);
        // Determine which endpoint to use based on user role
        let appointmentsEndpoint = `${import.meta.env.VITE_BACKEND_URL}/api/v1/appointment/patient/my-appointments`;
        
        if (user && user.role === "Doctor") {
          appointmentsEndpoint = `${import.meta.env.VITE_BACKEND_URL}/api/v1/appointment/doctor/my-appointments`;
        }

        // Fetch appointments
        const { data } = await axios.get(appointmentsEndpoint, {
          withCredentials: true,
        });
        setAppointments(data.appointments);

        // Fetch reports - use correct endpoint based on user role
        let reportsEndpoint = `${import.meta.env.VITE_BACKEND_URL}/api/v1/report/patient/my-reports`;
        if (user && user.role === "Doctor") {
          reportsEndpoint = `${import.meta.env.VITE_BACKEND_URL}/api/v1/report/doctor/my-reports`;
        }

        const reportsRes = await axios.get(reportsEndpoint, {
          withCredentials: true,
        });

        // Organize reports by appointmentId
        const reportsMap = {};
        reportsRes.data.reports.forEach((report) => {
          if (!reportsMap[report.appointmentId]) {
            reportsMap[report.appointmentId] = [];
          }
          reportsMap[report.appointmentId].push(report);
        });
        setReports(reportsMap);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch data");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAppointmentsAndReports();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const toggleAppointmentDetails = (appointmentId) => {
    setExpandedAppointment(
      expandedAppointment === appointmentId ? null : appointmentId
    );
  };

  const handleReportSubmit = async (appointmentId) => {
    if (!reportForm.reportTitle || !reportForm.reportContent) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setUploadingReport(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/report/upload`,
        {
          appointmentId,
          reportTitle: reportForm.reportTitle,
          reportContent: reportForm.reportContent,
        },
        { withCredentials: true }
      );

      toast.success("Report uploaded successfully!");
      setReports((prev) => ({
        ...prev,
        [appointmentId]: [
          ...(prev[appointmentId] || []),
          data.report,
        ],
      }));

      setReportForm({
        appointmentId: null,
        reportTitle: "",
        reportContent: "",
      });
      setShowReportForm(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload report");
    } finally {
      setUploadingReport(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setStatusUpdating((prev) => ({ ...prev, [appointmentId]: true }));
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/appointment/update/${appointmentId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );

      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  return (
    <section className="my-appointments-section">
      <div className="container">
        <h1>
          {user && user.role === "Doctor"
            ? "👨‍⚕️ My Patient Appointments & Reports"
            : "📋 My Appointments & Reports"}
        </h1>

        {loading ? (
          <div className="loading">Loading your appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="no-appointments">
            <p>No appointments found.</p>
            <p>Your appointments will appear here once booked.</p>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.map((apt) => (
              <div key={apt._id} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-info">
                    <h3>
                      {apt.department} - Dr. {apt.doctor.firstName}{" "}
                      {apt.doctor.lastName}
                    </h3>
                    <p className="appointment-date">
                      📅 {new Date(apt.appointment_date).toLocaleDateString()} at{" "}
                      {new Date(apt.appointment_date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="appointment-status">
                      Status:{" "}
                      <span
                        className={`status-badge status-${apt.status.toLowerCase()}`}
                      >
                        {apt.status}
                      </span>
                    </p>
                  </div>
                  <button
                    className="toggle-btn"
                    onClick={() => toggleAppointmentDetails(apt._id)}
                  >
                    {expandedAppointment === apt._id ? "▼ Hide" : "▶ Show"}{" "}
                    Details
                  </button>
                </div>

                {expandedAppointment === apt._id && (
                  <div className="appointment-details">
                    <div className="details-grid">
                      <div className="patient-info">
                        <h4>Patient Information</h4>
                        <div className="info-row">
                          <span className="label">Name:</span>
                          <span className="value">
                            {apt.firstName} {apt.lastName}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Email:</span>
                          <span className="value">{apt.email}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Phone:</span>
                          <span className="value">{apt.phone}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Address:</span>
                          <span className="value">{apt.address}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">NIC:</span>
                          <span className="value">{apt.nic}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Gender:</span>
                          <span className="value">{apt.gender}</span>
                        </div>
                      </div>

                      <div className="appointment-metadata">
                        <h4>Appointment Details</h4>
                        <div className="info-row">
                          <span className="label">Department:</span>
                          <span className="value">{apt.department}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Doctor:</span>
                          <span className="value">
                            Dr. {apt.doctor.firstName} {apt.doctor.lastName}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Status:</span>
                          <span
                            className={`value status-badge status-${apt.status.toLowerCase()}`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Date & Time:</span>
                          <span className="value">
                            {new Date(apt.appointment_date).toLocaleDateString()}{" "}
                            {new Date(apt.appointment_date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {user && (user.role === "Doctor" || user.role === "Admin") && (
                      <div className="staff-actions">
                        <div className="status-update">
                          <h4>Update Appointment Status</h4>
                          <div className="status-buttons">
                            {["Pending", "Accepted", "Rejected"].map((status) => (
                              <button
                                key={status}
                                className={`status-btn ${
                                  apt.status === status ? "active" : ""
                                }`}
                                onClick={() =>
                                  handleStatusUpdate(apt._id, status)
                                }
                                disabled={statusUpdating[apt._id]}
                              >
                                {statusUpdating[apt._id]
                                  ? "Updating..."
                                  : status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="reports-section">
                      <h4>📄 Medical Reports</h4>
                      {reports[apt._id] && reports[apt._id].length > 0 ? (
                        <div className="reports-list">
                          {reports[apt._id].map((report) => (
                            <div key={report._id} className="report-card">
                              <div className="report-header">
                                <h5>{report.reportTitle}</h5>
                                <p className="report-meta">
                                  By: {report.uploadedBy.name} (
                                  {report.uploadedBy.role})
                                </p>
                                <p className="report-date">
                                  {new Date(
                                    report.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="report-content">
                                <p>{report.reportContent}</p>
                              </div>
                              {report.reportFile &&
                                report.reportFile.url && (
                                  <div className="report-file">
                                    <a
                                      href={report.reportFile.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="file-link"
                                    >
                                      📎 Download Report File
                                    </a>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-reports">
                          No reports uploaded yet for this appointment.
                        </p>
                      )}

                      {user &&
                        (user.role === "Doctor" || user.role === "Admin") && (
                          <div className="add-report-section">
                            {showReportForm === apt._id ? (
                              <div className="report-form">
                                <input
                                  type="text"
                                  placeholder="Report Title (e.g., Lab Results, X-Ray Report)"
                                  value={reportForm.reportTitle}
                                  onChange={(e) =>
                                    setReportForm({
                                      ...reportForm,
                                      reportTitle: e.target.value,
                                    })
                                  }
                                  className="form-input"
                                />
                                <textarea
                                  placeholder="Report Content (write detailed findings/diagnosis)"
                                  value={reportForm.reportContent}
                                  onChange={(e) =>
                                    setReportForm({
                                      ...reportForm,
                                      reportContent: e.target.value,
                                    })
                                  }
                                  className="form-textarea"
                                  rows="6"
                                />
                                <div className="form-buttons">
                                  <button
                                    className="submit-btn"
                                    onClick={() =>
                                      handleReportSubmit(apt._id)
                                    }
                                    disabled={uploadingReport}
                                  >
                                    {uploadingReport
                                      ? "Uploading..."
                                      : "Submit Report"}
                                  </button>
                                  <button
                                    className="cancel-btn"
                                    onClick={() => setShowReportForm(null)}
                                    disabled={uploadingReport}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                className="add-report-btn"
                                onClick={() => setShowReportForm(apt._id)}
                              >
                                ➕ Add Report
                              </button>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyAppointments;
