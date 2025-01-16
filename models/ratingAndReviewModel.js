import mongoose from "mongoose";
const ratingAndReviewSchema = new mongoose.Schema({
 User:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
 rating:{type:Number,required:true},
 review:{type:String,required:true}
});
export const ratingAndReview = mongoose.model('ratingAndReview',ratingAndReview)
