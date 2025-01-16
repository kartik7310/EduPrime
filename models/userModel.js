import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  accountType: { type: String, enum: ["Admin", "Student", "Instructor"] },
  contact: { type: String, trim: true, required: true },
  additionDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  image: { type: String },
  course: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  courseProgress: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CourseProgress" },
  ],
  otp: {
    type: String, // Store the OTP itself
  },
  otpCreatedAt: {
    type: Date, // Timestamp when the OTP was created
    default: Date.now, // Automatically set to the current timestamp
    expires: 300, // Document expires 5 minutes after this timestamp
  },
  resetPasswordToken:{type:String,},
  resetPasswordTokenExpires:{type:Date}
});

export const User = mongoose.model("User", userSchema);

