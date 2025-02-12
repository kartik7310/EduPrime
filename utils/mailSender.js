import { mailSender } from "../config/nodemailer.js";
export const sendVerificationEmail = async (email, otp) => {
  try {
    const response = await mailSender(
      email,
      "Verification Email from EduPrime",
      `Your OTP code is: ${otp}. Please use this to verify your email.`
    );
    console.log(`Email sent successfully to ${email}: ${response}`);
    return response;
  } catch (error) {
    console.error(`Error sending verification email: ${error.message}`);
    return null; // Explicitly return null or false on failure
  }
};
