# MERN Hospital Management System 🏥

A full-stack hospital management system built using MongoDB, Express.js, React.js, and Node.js.
It allows patients to book appointments, doctors to manage them, and admins to control the system.

---

## 🔗 Live Deployment Links

- **Frontend (Patient & Doctor Portal):** https://mern-hospital-management-system-eight.vercel.app
- **Backend API:** https://mern-hospital-management-system-hdoa.onrender.com
- **Admin Dashboard:** (Coming Soon)
- **Database:** MongoDB Atlas

---

## ✨ Features

* Patient, Doctor, and Admin authentication & role-based access
* Appointment booking and management system
* Doctor department management
* Medical report handling and uploads
* Real-time appointment status updates
* Cloudinary integration for file uploads
* JWT-based secure authentication
* Cross-origin request handling with CORS

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* React Router
* Axios

**Backend:**
* Node.js & Express.js
* MongoDB Atlas
* JWT Authentication
* Cloudinary

**Deployment:**
* Vercel (Frontend)
* Render (Backend)

---

## 📦 Project Structure

```
MERN-Stack-Hospital-Management-System/
├── backend/              # Express.js API server
│   ├── controller/       # Route controllers
│   ├── models/          # MongoDB schemas
│   ├── router/          # API routes
│   ├── middlewares/     # Auth & error handling
│   └── database/        # DB connection
├── frontend/            # React patient portal
│   ├── src/
│   │   ├── Pages/      # Login, Register, Appointments
│   │   ├── components/ # Reusable UI components
│   │   └── App.jsx
└── dashboard/           # Admin dashboard (React)
    └── src/
        ├── components/ # Admin pages
        └── App.jsx
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js & npm installed
- MongoDB Atlas account with connection string
- Cloudinary account (optional, for file uploads)

### Backend Setup

```bash
cd backend
npm install
# Create .env file with:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_SECRET_KEY=your_jwt_secret_key
COOKIE_EXPIRE=7
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

npm start
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
# Create .env file with:
VITE_BACKEND_URL=http://localhost:5000

npm run dev
# Frontend runs on http://localhost:5173
```

### Dashboard Setup

```bash
cd dashboard
npm install
# Create .env file with:
VITE_BACKEND_URL=http://localhost:5000

npm run dev
# Dashboard runs on http://localhost:5174
```

---

## 🔐 Authentication

- **Patient Login:** `/login` - Email & Password
- **Doctor Login:** `/doctor-login` - Email & Password
- **Admin Login:** Dashboard - Email & Password
- **Registration:** Patient registration available at `/register`

---

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hospitalDB
JWT_SECRET=your_secret_key
JWT_SECRET_KEY=your_jwt_key
COOKIE_EXPIRE=7
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)
```
VITE_BACKEND_URL=https://mern-hospital-management-system-hdoa.onrender.com
```

### Dashboard (.env)
```
VITE_BACKEND_URL=https://mern-hospital-management-system-hdoa.onrender.com
```

---

## 📚 API Endpoints

### User Routes
- `POST /api/v1/user/patient/register` - Patient registration
- `POST /api/v1/user/login` - Login (Patient/Doctor/Admin)
- `GET /api/v1/user/patient/me` - Get patient profile
- `GET /api/v1/user/admin/me` - Get admin profile
- `GET /api/v1/user/doctors` - Get all doctors

### Appointment Routes
- `POST /api/v1/appointment/post` - Book appointment
- `GET /api/v1/appointment/getall` - Get all appointments (Admin)
- `GET /api/v1/appointment/patient/my-appointments` - Patient appointments
- `GET /api/v1/appointment/doctor/my-appointments` - Doctor appointments
- `PUT /api/v1/appointment/update/:id` - Update appointment status
- `DELETE /api/v1/appointment/delete/:id` - Delete appointment

### Report Routes
- `POST /api/v1/report/upload` - Upload medical report
- `GET /api/v1/report/patient/my-reports` - Get patient reports
- `GET /api/v1/report/doctor/my-reports` - Get doctor reports

---

## 🎓 Learning Outcomes

This project helped me gain hands-on experience in:
- Full-stack web application development
- User authentication & authorization with JWT
- RESTful API design and implementation
- Database design and MongoDB operations
- Frontend state management with React Context
- Deployment to Vercel & Render
- CORS configuration for cross-origin requests
- Error handling and debugging
- File upload handling with Cloudinary

---

## 👨‍💻 Developer

Siddhu Bhima

---

## 📄 License

This project is open source and available for educational purposes.
