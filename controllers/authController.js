import {User} from "../models/userModel.js"
import {Profile} from "../models/profileModel.js"
import bcrypt from 'bcrypt'
import { mailSender } from "../config/nodemailer.js";
import { sendVerificationEmail } from "../utils/mailSender.js";
import {generateJwtToken} from "../utils/generateJwt.js"
import {secureOtpGenerator} from "../utils/otpGenerator.js"
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, accountType, contact } = req.body;
    // Validate input
    if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password and confirm password do not match" });
    }

    const isUser = await User.findOne({ $or: [{ email }, { contact }] });
    if (isUser) {
      return res.status(400).json({ message: "User is already registered" });
    }

    // Generate OTP and hash password
    const otpCode = await secureOtpGenerator();
    await sendVerificationEmail(email, otpCode);
    const hashPassword = await bcrypt.hash(password, 10);

    // Create Profile and User
    const profile = await Profile.create({ dateOfBirth: null, gender: null, about: null });
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      accountType,
      contact,
      otp: otpCode,
      additionDetails: profile._id,
      image: `imageUrl`,
    });
    await user.save();

    return res.status(200).json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist. Please sign up first." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateJwtToken({ id: user._id, role: user.accountType });
    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ success: true, message: "User logged in successfully" });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { password, newPassword, confirmPassword } = req.body;

    if (!password || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();

    await mailSender(user.email, "Password Changed", "Your password has been successfully changed.");
    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
