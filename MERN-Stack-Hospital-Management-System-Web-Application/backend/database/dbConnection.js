import mongoose from "mongoose";

export const dbConnection = () => {
  console.log("ENV CHECK:", process.env.MONGO_URI);

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to database!");
      console.log("CONNECTED DB:", mongoose.connection.name);
    })
    .catch((err) => {
      console.log("DB ERROR:", err);
    });
};