import { User } from "../models/userModel.js";
import { mailSender } from "../config/nodemailer.js";
import { errorHandler } from "../utils/error.js";
export const sendPasswordResetLink = async (req, res, next) => {
  try {
    // get email and check this email
         const { email } = req.body;
         if (!email) {
           return next(new errorHandler("email not provide"));
         }
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(email)) {
          return next(new errorHandler("email format not correct"));
         }
         const user = await User.findOne({ email });
         if (!user) {
          return next(new errorHandler("user not found with this email"));
         }
         const token = crypto.randomUUID();
         const updateUser = await User.findByIdAndUpdate(
           { email },{  resetPasswordToken: token,  resetPasswordTokenExpires: Date.now() + 5 * 60 * 1000,},{ new: true }
         );
         const url = `process.env.FRONTEND_URL${token}`;
         await mailSender(email,"password reset link ",`password reset link ${url}`);
         return res
           .status(200)
           .json({ success: true, message: "email send successfully" });
     }  catch (error) {
      next(error)
  }
};

export const resetPassword = async(req,res,next)=>{
  try {
     
      const {password,confirmPassword,token}=req.body;
      if(!password||!confirmPassword||!token){
        return next(new errorHandler("all fields are required"))
      }
      if(password !== confirmPassword){
        return next(new errorHandler("password are not same"))
      }
      const user = await User.findOne({token});
      if(!user){
        return next(new errorHandler("user not found"))
      }
      if(user.resetPasswordTokenExpires>Date.now()){
        return next(new errorHandler("invalid token"))
      }
       const hashPassword = await bcrypt.hash(password,10);
       const updateUser = await User.findOneAndUpdate({token},{password:hashPassword},{new:true});
        if(!updateUser){
          return next(new errorHandler("update password failed"))
        }
        return res.status(200).json({success:true,message:'password update successfully'})
      } catch (error) {
        next(error)
      }
}  