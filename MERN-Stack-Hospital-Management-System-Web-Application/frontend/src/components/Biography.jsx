import React from "react";

const Biography = ({ imageUrl }) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="about-zenithcare" />
        </div>

        <div className="banner">
          <p>About Us</p>
          <h3>Who We Are</h3>

          <p>
            ZenithCare Medical Institute is a modern healthcare platform
            designed to provide efficient and patient-focused medical services.
            Our system simplifies appointment scheduling, user management, and
            communication between patients and healthcare professionals.
          </p>

          <p>
            We aim to deliver a seamless healthcare experience by combining
            technology with reliability. Our platform ensures that patients can
            easily access services while healthcare providers can manage their
            operations effectively.
          </p>

          <p>
            This application is built using the MERN stack (MongoDB, Express.js,
            React, and Node.js), ensuring a scalable and high-performance
            system suitable for real-world healthcare environments.
          </p>

          <p>
            At ZenithCare, we focus on simplicity, accuracy, and accessibility,
            making healthcare services more organized and user-friendly.
          </p>
        </div>
      </div>
    </>
  );
};

export default Biography;