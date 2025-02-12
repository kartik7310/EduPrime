import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  accountType: { type: String, enum: ["Student", "Instructor"] },
  contact: { type: String, trim: true, required: true },
  additionDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  image: { type: String },
  course: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  courseProgress: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CourseProgress" },
  ],
  resetPasswordToken:{type:String,},
  resetPasswordTokenExpires:{type:Date}
});

export const User = mongoose.model("User", userSchema);

