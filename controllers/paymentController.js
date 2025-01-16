import {instance} from '../config/razorpay.js'
import {Course} from '../models/courseModel.js';
import { User } from '../models/userModel.js';
import { mailSender } from '../config/nodemailer.js';
import mongoose from 'mongoose';
//courseEnroll template

//capture the payment  and initiate the Razorpay order

const capturePayment = async(req,res)=>{
        //get ussrId and courseId
          const{courseId} = req.body;
          const userId = req.user.id;
          if(!courseId){
              return res.status(400).json({message:"course id not provide"})
           }
           let course;
    try {
       //valid courseId
          course = await Course.findById({courseId});
          if(!course){
         return res.json({success:false,message:'could not found course'})
      }
         //user already pay for same course
           const uid = new mongoose.Types.ObjectId(userId);
          if(course.studentEnrolled.includes(uid)){
            return res.json({success:false,message:'Student is already enrolled '})
          }
  
    } catch (error) {
      return res.status(500).json({success:false,message:error.message})
    }
  
    //create order
 const amount = course.price;
 const currency = course.currency;

 //create option
 const options ={
    amount:amount*100,
    currency,
    receipt:Math.random(Date.now()).toString(),
    notes:{
      courseId,
      userId,
    }
 }
//initiate payment
try {
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
               courseName:course.courseName,
               courseDescription:course.courseDescription,
               thumbnail:course.thumbnail,
               orderId:paymentResponse.id,
               currency:paymentResponse.currency,
               amount:paymentResponse.amount
               
    })
  }       catch (error) {
         return res.status(500).json({success:false,message:'could not initiate order'})
}

  }
// verify signature of razorpay and server
  const verifySignature =async(req,res)=>{
    const webhookSecrete = '1234456';
    const signature = req.headers['x-razorpay-signature']

  }