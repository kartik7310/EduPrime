import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Store the email
  otp: { type: String, required: true }, // Store the OTP itself
  otpCreatedAt: {
    type: Date, // Timestamp when the OTP was created
    default: Date.now, // Automatically set to the current timestamp
    expires: 300, // Document expires 5 minutes after creation
  },
});

export const OTP = mongoose.model("OTP", otpSchema);
