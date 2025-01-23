import { instance } from "../config/razorpay.js";
import { Course } from "../models/courseModel.js";
import { User } from "../models/userModel.js";
import { mailSender } from "../config/nodemailer.js";
import mongoose from "mongoose";
//courseEnroll template

//capture the payment  and initiate the Razorpay order
 export const capturePayment = async (req, res) => {
             // Get userId and courseId
             const { courseId } = req.body;
             const userId = req.user?.id; // Ensure user is authenticated

   // Validate courseId and userId
    if (!courseId || !userId) {
      return res
        .status(400)
         .json({ message: "Course ID or user ID is not provided" });
   }

    let course;
   try {
    // Validate courseId
    course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Check if the user is already enrolled
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentEnrolled.includes(uid)) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

  // Create order
    const amount = course.price;
    const currency = "INR";

  // Create options for Razorpay
  const options = {
    amount: amount * 100, // Convert to smallest currency unit (paise)
    currency,
    receipt: `receipt_${Date.now()}`, // Unique receipt ID
    notes: {
      courseId,
      userId,
    },
  };

  try {
    // Initiate payment using Razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);

    return res.status(200).json({
         success: true,
         courseName: course.courseName,
         courseDescription: course.courseDescription,
         thumbnail: course.thumbnail,
         orderId: paymentResponse.id,
         currency: paymentResponse.currency,
         amount: paymentResponse.amount,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not initiate order. Please try again later.",
    });
  }
};
// verify signature of razorpay and server
export const verifySignature = async (req, res) => {
        const webhookSecrete = "1234456";
        const signature = req.headers["x-razorpay-signature"];
        const shasum = crypto.createHmac("sha256", webhookSecrete);
        shasum.update(json.stringify(req.body));
        const digest = shasum.digest("hex");
         if (signature == digest) {
             console.log("payment is Authorised");
              // find the course and enroll the student
         try {
          const { userId, courseId } = req.body.payload.payment.entity.notes;
          const enrolledCourse = await Course.findByIdAndUpdate(
              { courseId },
              { $push: { studentEnrolled: userId } },
              { new: true }
      );
          console.log(enrolledCourse);

      if (!enrolledCourse) {
        return res.status(400).json({ message: "course not found" });
      }
      //find student and add into course
      const enrolledStudent = await User.findByIdAndUpdate(
        { userId },
        { $push: { course: courseId } },
        { new: true }
      );
      console.log(enrolledStudent);
      //send email
      const sendEnrolledEmail = await mailSender(
        enrolledStudent.email,
        "congratulations from eduPrime",
        "congratulations,you are enrolled into new course"
      );
      return res
        .status(200)
        .json({
          success: true,
          message: "signature verified and course added",
        });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(400).json({ message: "signature not match" });
  }
};
