import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { User } from "./models/userSchema.js";

config({ path: "./.env" });

const createTestDoctor = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Test Doctor 1
    const doctor1 = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@hospital.com",
      password: "Doctor@123",
      phone: "9876543210",
      nic: "123456789012",
      dob: new Date("1985-05-15"),
      gender: "Male",
      role: "Doctor",
      doctorDepartment: ["Cardiology", "Internal Medicine"],
    };

    // Check if doctor already exists
    const existingDoctor1 = await User.findOne({ email: doctor1.email });
    if (existingDoctor1) {
      console.log("Doctor 1 already exists!");
    } else {
      const newDoctor1 = await User.create(doctor1);
      console.log("✅ Doctor 1 Created Successfully!");
      console.log("📧 Email: johndoe@hospital.com");
      console.log("🔐 Password: Doctor@123");
      console.log("-----------------------------------");
    }

    // Test Doctor 2
    const doctor2 = {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarahjohnson@hospital.com",
      password: "Doctor@456",
      phone: "9876543211",
      nic: "123456789013",
      dob: new Date("1988-08-22"),
      gender: "Female",
      role: "Doctor",
      doctorDepartment: ["Neurology", "General Surgery"],
    };

    const existingDoctor2 = await User.findOne({ email: doctor2.email });
    if (existingDoctor2) {
      console.log("Doctor 2 already exists!");
    } else {
      const newDoctor2 = await User.create(doctor2);
      console.log("✅ Doctor 2 Created Successfully!");
      console.log("📧 Email: sarahjohnson@hospital.com");
      console.log("🔐 Password: Doctor@456");
      console.log("-----------------------------------");
    }

    // Test Doctor 3
    const doctor3 = {
      firstName: "Michael",
      lastName: "Smith",
      email: "michaelsmith@hospital.com",
      password: "Doctor@789",
      phone: "9876543212",
      nic: "123456789014",
      dob: new Date("1982-03-10"),
      gender: "Male",
      role: "Doctor",
      doctorDepartment: ["Pediatrics", "Orthopedics"],
    };

    const existingDoctor3 = await User.findOne({ email: doctor3.email });
    if (existingDoctor3) {
      console.log("Doctor 3 already exists!");
    } else {
      const newDoctor3 = await User.create(doctor3);
      console.log("✅ Doctor 3 Created Successfully!");
      console.log("📧 Email: michaelsmith@hospital.com");
      console.log("🔐 Password: Doctor@789");
      console.log("-----------------------------------");
    }

    console.log("\n✨ Test doctors created/verified successfully!");
    console.log("\nYou can now login with these credentials:");
    console.log("1. johndoe@hospital.com / Doctor@123");
    console.log("2. sarahjohnson@hospital.com / Doctor@456");
    console.log("3. michaelsmith@hospital.com / Doctor@789");

    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createTestDoctor();
