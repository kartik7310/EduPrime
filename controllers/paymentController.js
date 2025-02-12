import { instance } from "../config/razorpay.js";
import { Course } from "../models/courseModel.js";
import { User } from "../models/userModel.js";
import { mailSender } from "../config/nodemailer.js";
import mongoose from "mongoose";
import { errorHandler } from "../utils/error.js";
//courseEnroll template

//capture the payment  and initiate the Razorpay order

export const capturePayment = async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.user?.id; // Ensure user is authenticated

  if (!courseId || !userId) {
    return next(new errorHandler("courseId and userId are required", 400));
  }

  try {
    // Fetch course and validate
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new errorHandler("Course not found", 404));
    }

    // Check for duplicate enrollment
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentEnrolled.includes(uid)) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }

    // Validate course price
    const amount = course.price;
    if (!amount || amount <= 0) {
      return next(new errorHandler("Invalid course price", 400));
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId,
        userId,
      },
    };

    const paymentResponse = await instance.orders.create(options);

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
    console.error("Payment Error:", error.message);
    return next(new errorHandler("Could not initiate order. Please try again later.", 500));
  }
};

export const verifySignature = async (req, res, next) => {
  try {
    // Use environment variable for webhook secret
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      return res.status(400).json({ success: false, message: "Missing signature" });
    }

    // Verify Razorpay signature
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature !== digest) {
      return res.status(400).json({ success: false, message: "Signature does not match" });
    }

    console.log("Payment is authorized");

    // Extract userId and courseId from the Razorpay notes
    const { userId, courseId } = req.body.payload.payment.entity.notes;

    if (!userId || !courseId) {
      return res.status(400).json({ success: false, message: "Invalid data: userId or courseId missing" });
    }

    // Use a transaction to ensure atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update course enrollment
      const enrolledCourse = await Course.findByIdAndUpdate(
        courseId,
        { $addToSet: { studentEnrolled: userId } }, // Avoid duplicate additions
        { new: true, session }
      );

      if (!enrolledCourse) {
        throw new Error("Course not found");
      }

      // Update student's enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { courses: courseId } }, // Avoid duplicate additions
        { new: true, session }
      );

      if (!enrolledStudent) {
        throw new Error("Student not found");
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      console.log("Enrollment successful:", { enrolledCourse, enrolledStudent });

      // Send email notification
      await mailSender(
        enrolledStudent.email,
        "Congratulations from EduPrime",
        "Congratulations, you have been enrolled in a new course!"
      );

      return res.status(200).json({
        success: true,
        message: "Signature verified and course enrollment successful",
      });
    } catch (error) {
      // Rollback transaction on failure
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Verification Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};