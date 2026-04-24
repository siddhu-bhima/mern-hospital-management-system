import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Appointment from "./Pages/Appointment";
import AboutUs from "./Pages/AboutUs";
import Register from "./Pages/Register";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import Login from "./Pages/Login";
import DoctorLogin from "./Pages/DoctorLogin";
import MyAppointments from "./Pages/MyAppointments";
import.meta.env.VITE_BACKEND_URL;
const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser, user } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      // Don't fetch if we already have user data
      if (user && user._id) {
        return;
      }

      try {
        // Try patient endpoint first
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/patient/me`,
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        // If patient endpoint fails, try admin/doctor endpoint
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/admin/me`,
            {
              withCredentials: true,
            }
          );
          setIsAuthenticated(true);
          setUser(response.data.user);
        } catch (doctorError) {
          // Neither endpoint worked, user is not authenticated
          // Don't show error - this is expected when not logged in
          setIsAuthenticated(false);
          setUser({});
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
