import {User} from "../models/userModel.js"
import {Profile} from "../models/profileModel.js"
import bcrypt from 'bcrypt'
import { mailSender } from "../utils/mailSender.js";
import { sendVerificationEmail } from "../utils/mailSender.js";
import {generateJwtToken} from "../utils/generateJwt.js"

const signup = async(req,res)=>{
  try {
    const {firstName,lastName,email,password,confirmPassword,accountType,contact} = req.body;
    if(!firstName||!lastName||!email||!password||!confirmPassword||!accountType||!contact){
      return res.status(200).json({message:"all fields are required"})
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if(password!==confirmPassword){
      return res.status(400).json({message:'password or confirmPassword not same'})
    }
    const isUser = await User.findUnique({$or:[{email},{contact}]});
      if(isUser){
        return res.status(400).json({message:'user is already register'})
      }
       //otp generator
         const otpCode = await secureOtpGenerator();
         await sendVerificationEmail(email,otp)
          const hashPassword = await bcrypt.hash(password,10);
         const profile = await Profile.create({dateOfBirth:null,gender:null,about:null})
         const user = await User.create({email,password:hashPassword,firstName,lastName,accountType,contact,otp:otpCode,additionDetails:profile._id,image:`imageUrl`});
 
        return res.status(200).json({success:true,message:'user register successfully',user})
  }catch (error) {
    console.log(error);
    
  }
}

const login = async(req,res)=>{
  try {
    const {email,password} = req.body;
    if(!email||!password){
      return res.status(400).json({message:"all field are required"})
    }
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({message:"user not exist please signup first"})
    }
    if(await bcrypt.compare(password,user.password)){
     const token = generateJwtToken({id:user._id,role:user.role})
     res.cookie("token",token,{expires:new Date(Date.now()+3*24*60*1000),httpOnly:true}).status(200).json({success:true,message:'user login successfully'})
    }else{
      return res.status(401).json({success:false,message:'invalid email or password'})
    }
    
  } catch (error) {
    console.log(error);
    
  }
}

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
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

