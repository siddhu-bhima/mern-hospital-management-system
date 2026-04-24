import mongoose from "mongoose";
import { config } from "dotenv";
import { User } from "./models/userSchema.js";

config({ path: "./.env" });

const addDoctors = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB!\n");

    // Delete existing test doctors first
    await User.deleteMany({
      email: {
        $in: [
          "johndoe@hospital.com",
          "sarahjohnson@hospital.com",
          "michaelsmith@hospital.com",
        ],
      },
    });
    console.log("🗑️  Cleaned up old test doctors\n");

    // Create test doctors with PLAIN TEXT passwords (will be hashed by pre-save hook)
    const doctors = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@hospital.com",
        phone: "9876543210",
        nic: "123456789012",
        dob: new Date("1985-05-15"),
        gender: "Male",
        password: "Doctor@123", // Plain text - will be hashed by pre-save hook
        role: "Doctor",
        doctorDepartment: ["Cardiology", "Internal Medicine"],
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarahjohnson@hospital.com",
        phone: "9876543211",
        nic: "123456789013",
        dob: new Date("1988-08-22"),
        gender: "Female",
        password: "Doctor@456", // Plain text - will be hashed by pre-save hook
        role: "Doctor",
        doctorDepartment: ["Neurology", "General Surgery"],
      },
      {
        firstName: "Michael",
        lastName: "Smith",
        email: "michaelsmith@hospital.com",
        phone: "9876543212",
        nic: "123456789014",
        dob: new Date("1982-03-10"),
        gender: "Male",
        password: "Doctor@789", // Plain text - will be hashed by pre-save hook
        role: "Doctor",
        doctorDepartment: ["Pediatrics", "Orthopedics"],
      },
    ];

    // Create doctors one by one (this WILL trigger pre-save password hashing)
    for (const doctor of doctors) {
      const createdDoctor = await User.create(doctor);
      console.log(`✅ Created: ${createdDoctor.firstName} ${createdDoctor.lastName}`);
    }
    console.log("\n✅ Successfully added 3 test doctors!\n");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 DOCTOR LOGIN CREDENTIALS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    doctors.forEach((doctor, index) => {
      const password = [
        "Doctor@123",
        "Doctor@456",
        "Doctor@789",
      ][index];
      console.log(`👨‍⚕️  Doctor ${index + 1}: ${doctor.firstName} ${doctor.lastName}`);
      console.log(`   📧 Email: ${doctor.email}`);
      console.log(`   🔐 Password: ${password}`);
      console.log(`   🏥 Departments: ${doctor.doctorDepartment.join(", ")}\n`);
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✨ You can now login with these credentials!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    await mongoose.disconnect();
    console.log("✅ Database disconnected");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach((key) => {
        console.error(`   - ${key}: ${error.errors[key].message}`);
      });
    }
    console.error("Full Error:", error);
    process.exit(1);
  }
};

addDoctors();
