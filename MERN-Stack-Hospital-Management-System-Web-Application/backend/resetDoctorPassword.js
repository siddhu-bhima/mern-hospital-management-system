import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { User } from "./models/userSchema.js";

config({ path: "./.env" });

const resetDoctorPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔗 Connected to MongoDB");

    // Find Dr. Strange
    const doctor = await User.findOne({ 
      firstName: "Dr",
      lastName: "Strange"
    });

    if (!doctor) {
      console.log("❌ Doctor not found!");
      console.log("\nAvailable doctors:");
      const allDoctors = await User.find({ role: "Doctor" });
      allDoctors.forEach(doc => {
        console.log(`- ${doc.firstName} ${doc.lastName} (${doc.email})`);
      });
      await mongoose.connection.close();
      return;
    }

    // New password
    const newPassword = "DrStrange@123";
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the password
    doctor.password = hashedPassword;
    await doctor.save();

    console.log("✅ Password Reset Successfully!");
    console.log("📧 Email: " + doctor.email);
    console.log("🔐 New Password: " + newPassword);
    console.log("\nYou can now login with these credentials!");

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

resetDoctorPassword();
