import mongoose  from "mongoose";
const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true, trim: true },
  courseDescription: { type: String, required: true, trim: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'User' },
  whatYouWillLearn: { type: String,trim:true},
  courseContent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
  ratingAndReviews: [
    { type: mongoose.Schema.Types.ObjectId, ref: "RatingAndReview" },
  ],
  price: { type: Number },
  thumbnail: { type: String },
  Category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  tag:{type:string},
  studentEnrolled: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
});
export const Course = mongoose.model("Course", courseSchema);
