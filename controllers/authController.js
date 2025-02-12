import {User} from "../models/userModel.js"
import {Profile} from "../models/profileModel.js"
import bcrypt from 'bcrypt'
import { mailSender } from "../config/nodemailer.js";
import { sendVerificationEmail } from "../utils/mailSender.js";
import {generateJwtToken} from "../utils/generateJwt.js"
import {secureOtpGenerator} from "../utils/otpGenerator.js"
import { errorHandler } from "../utils/error.js";
import {OTP} from "../models/otpModel.js"

export const sendTop = async (req, res,next) => {
  try {
    const { email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
       return next(new errorHandler("Invalid email format"));
    }

    // Generate OTP
    const otpCode = secureOtpGenerator();
    console.log(otpCode);
    
    console.log(`Generated OTP: ${otpCode}`);

    // Send verification email
    const emailSent = await sendVerificationEmail(email, otpCode);

    
          if (!emailSent) {
            return next(new errorHandler("Failed to send verification email" ));
          }

    // Store OTP in the database
    await OTP.create({email,otp: otpCode});
    console.log(`OTP stored for email: ${email}`);

    // Respond with success message
    res.status(200).json({ message: "OTP sent successfully", otpCode });
  } catch (error) {
   next(error)
  }
};

export const signup = async (req, res,next) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, accountType, contact,otp } = req.body;
    // Validate input
    if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !contact,!otp) {
      return next(new errorHandler("All fields are required" ));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new errorHandler( "Invalid email format" ));
    }

    if (password !== confirmPassword) {
      return next(new errorHandler("Password and confirm password do not match" ));
    }

    const isUser = await User.findOne({ $or: [{ email }, { contact }] });
    if (isUser) {
      return next(new errorHandler("User is already registered" ));
    }
   
  
    // Validate OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return next(new errorHandler("Invalid OTP" ));
    }

    // Check if the OTP has expired
    const currentTime = new Date();
    if (currentTime < otpRecord.otpCreatedAt) {
      return next(new errorHandler("OTP has expired" ));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Create Profile and User
    const profile = await Profile.create({ dateOfBirth: null, gender: null, about: null,contact:null });
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      accountType,
      contact,
      additionDetails: profile._id,
      image: `imageUrl`,
    });
    await user.save();

    return res.status(200).json({ success: true, message: "User registered successfully", user });
  } catch (error) {
   next(error)
  }
};

export const login = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new errorHandler("all fields are required" ));
    }

    const user = await User.findOne({ email });
    // console.log(user);
    
    if (!user) {
      return next(new errorHandler("user does't exist ,please login first" ));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return next(new errorHandler(" invalid email or password" ));
    }

    const token = generateJwtToken({ id: user._id, accountType: user.accountType });
    console.log(token);
    
    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ success: true, message: "User logged in successfully" });
  } catch (error) {
    next(error)
  }
};

export const changePassword = async (req, res,next) => {
  try {
    const userId = req.user.id;
    const { password, newPassword, confirmPassword } = req.body;

    if (!password || !newPassword || !confirmPassword) {
      return next(new errorHandler("all fields are required" ));
    }

    if (newPassword !== confirmPassword) {
      return next(new errorHandler("new password or confirmed password are not match" ));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new errorHandler("User not found" )); 
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
     return next(new errorHandler("Old password is incorrect" )); 
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();

    await mailSender(user.email, "Password Changed", "Your password has been successfully changed.");
    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error)
  }
};
