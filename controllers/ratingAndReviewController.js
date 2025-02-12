import { RatingAndReview } from "../models/ratingAndReviewModel.js";
import { Course } from "../models/courseModel.js";
import { errorHandler } from "../utils/error.js";
import e from "express";


export const createRatingAndReview = async(req,res)=>{
try {
  
      //get data from req 
      const{rating,review} = req.body;
      const courseId = req.params
      //get user id from middleware
      const userId = req.user.id;
      //validation
      if(!courseId||!rating||!review){
       return next(new errorHandler("all fields are required"))
      }
      //check user is enrolled or not
    const courseDetails = await Course.findOne({
                                            id:courseId,
                                            studentEnrolled:{$elemMatch:{$eq:userId}}
                                          });
              if(!courseDetails){
                return next(new errorHandler("course details not found"))
              }
              //check rating and review already exist or not
      const alreadyRatingAndReview = await RatingAndReview.findById(
                                                              {user:userId},
                                                              {course:courseId}
                                                              )
        if(alreadyRatingAndReview){
          return next(new errorHandler("you have already given the rating"))
        }
        //create review and rating
      const ratingAndReview = await RatingAndReview.create({
                                                        rating:Number(rating),
                                                        review,
                                                           course:courseId,
                                                           user:userId
                                                        });
                    // create rating and review 
                        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                                                   {
                                                     $push:{
                                                      ratingAndReviews:ratingAndReview._id
                                                     }
                                                   },
                                                   {new:true}
                                                  )
                            console.log(updatedCourseDetails);              
      //send response
             return res.status(200).json(
           {
             success:true,
             message:'review and rating created successfully',
             data:ratingAndReview
           }
      )
  } catch (error) {
 next(error)
 }
}

export const getAverageRating = async (req,res)=>{
    try {
      //get courseId
      const{courseId}= req.params;
      if(!courseId){
        return next(new errorHandler(400,"courseId not provide"))
      }
      
      //calculate avg rating
      const result = await RatingAndReview.aggregate([
                {
                    $match:{
                      course:new mongoose.Types.ObjectId(courseId)
                    } 
                   },
                      {
                         $group:{
                         _id:null,
                         averageRating:{$avg:'$rating'}
                        }
                    }
                      ])
                //return rating
                if(result.length>0){
                  return res.status(200).json({
                    success:true,
                    averageRating:result[0].averageRating
                  })
                }
            return res.status(200).json({
              success:true,
              message:'Average rating is 0,no rating given till now',
              averageRating:0
            })
      //if not avg rating/review exist
    } catch (error) {
      next(error)
    }
  }

 export const getAllRating = async (req,res,next)=>{
  try {
      const allReview = await RatingAndReview.find({})
                                               .sort({rating:'desc'})
                                               .populate(
                                                {
                                                  path:'User',
                                                  select:"firstName lastName email image "
                                                }
                                               )
                                               .populate(
                                                {
                                                  path:'Course',
                                                  select:"courseName"
                                                }
                                               ).exec();
                                  if(!allReview){
                                    return next(new errorHandler(404,"review not found"))
                                
                                  }
      return res.status(200).json(
        {
          success:true,
          message:'all  review fetched successfully',
          data:allReview
        }
      )
              
  } catch (error) {
    next(error)
  }
  }
  
export async function deleteReviewAndRating(req, res, next) {
  try {
    const { id } = req.user; // Authenticated user's ID
    const { courseId } = req.params; // Extract course ID from URL params

    if (!courseId) {
      return next(new errorHandler("Course ID not found", 400));
    }

    // Check if the user has reviewed the course
    const userExist = await RatingAndReview.findOne({ userId: id });
    if (!userExist) {
      return next(new errorHandler("User not found", 404));
    }

    // Ensure user is allowed to delete their review
    if (userExist.userId.toString() !== id.toString()) {
      return next(new errorHandler("You cannot delete this reviewAndRating", 403));
    }

    // Delete the review and update the course accordingly
    const updateCourse = await Course.findOneAndDelete({
      $or: [
        { _id: courseId },
        { userId: id }
      ]
    });

    if (!updateCourse) {
      return next(new errorHandler("Course not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}



