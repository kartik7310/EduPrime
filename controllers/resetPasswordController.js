import { User } from "../models/userModel.js";
import { mailSender } from "../config/nodemailer.js";
const sendPasswordResetLink = async (req, res, next) => {
  try {
    // get email and check this email
         const { email } = req.body;
         if (!email) {
           return res.status(400).json({ message: "email not provide" });
         }
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(email)) {
           return res.status(400).json({ message: "email format not correct" });
         }
         const user = await User.findOne({ email });
         if (!user) {
             return res.status(400).json({ message: "user not found with this email" });
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
  }      catch (error) {
      console.log("error during resetPassword", error);
  }
};

const resetPassword = async(req,res)=>{
  try {
      //todos:
      //get password,confirmPasswordToken,token
        //check both password are same or not
      //find User with token or check this token is less than time duration
      //hashPassword
      //update user with new password
      //return response
      const {password,confirmPassword,token}=req.body;
      if(!password||!confirmPassword||!token){
        return res.status(400).json({message:"all fields are required"})
      }
      if(password !== confirmPassword){
        return res.status(401).json({message:"password are not same"})
      }
      const user = await User.findOne({token});
      if(!user){return res.status(400).json({message:"user not found"})};
      if(user.resetPasswordTokenExpires>Date.now()){
        return res.status(401).json({message:'invalid token'})
      }
       const hashPassword = await bcrypt.hash(password,10);
       const updateUser = await User.findOneAndUpdate({token},{password:hashPassword},{new:true});
        if(!updateUser){
          return res.status(400).json({message:'update password failed'})
        }
        return res.status(200).json({success:true,message:'password update successfully'})
      } catch (error) {
        console.log(error);
        
      }
}  