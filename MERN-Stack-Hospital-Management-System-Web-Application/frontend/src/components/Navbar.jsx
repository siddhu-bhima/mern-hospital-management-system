import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import.meta.env.VITE_BACKEND_URL;
const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      // Determine logout endpoint based on user role
      const logoutEndpoint =
        user && user.role === "Doctor"
          ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/admin/logout`
          : `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/patient/logout`;

      const res = await axios.get(logoutEndpoint, {
        withCredentials: true,
      });
      
      toast.success(res.data.message);
      setIsAuthenticated(false);
      navigateTo("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const goToLogin = () => {
    navigateTo("/login");
  };

  const goToDoctorLogin = () => {
    navigateTo("/doctor-login");
  };

  return (
    <>
      <nav className={"container"}>
        <div className="logo">
          <img src="/logo.png" alt="logo" className="logo-img" />
        </div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link to={"/"} onClick={() => setShow(!show)}>
              Home
            </Link>
            <Link to={"/appointment"} onClick={() => setShow(!show)}>
              Appointment
            </Link>
            {isAuthenticated && (
              <Link to={"/my-appointments"} onClick={() => setShow(!show)}>
                My Appointments
              </Link>
            )}
            <Link to={"/about"} onClick={() => setShow(!show)}>
              About Us
            </Link>
          </div>
          {isAuthenticated ? (
            <button className="logoutBtn btn" onClick={handleLogout}>
              LOGOUT
            </button>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="loginBtn btn" onClick={goToLogin}>
                PATIENT LOGIN
              </button>
              <button
                className="loginBtn btn"
                onClick={goToDoctorLogin}
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                }}
              >
                DOCTOR LOGIN
              </button>
            </div>
          )}
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
