import mongoose from "mongoose";
export const mongoConnection = async () => {
  const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/EduPrime";
  try {
    await mongoose.connect(mongoUrl);
    console.log("DB is connected successfully");
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1); // Exit the process with failure code
  }
};
