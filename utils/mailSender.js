import { mailSender } from "../config/nodemailer.js";
export const sendVerificationEmail = async(email,otp)=>{
try {
  const response = await mailSender(email,'Verification Email from Britan coaching center',otp)
} catch (error) {
  console.log(error); 
}
}