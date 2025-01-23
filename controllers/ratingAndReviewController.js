import { RatingAndReview } from "../models/ratingAndReviewModel.js";
import { Course } from "../models/courseModel.js";


export const createRatingAndReview = async(req,res)=>{
try {
  
      //get data from req 
      const{rating,review,courseId} = req.body;
      //get user id from middleware
      const userId = req.user.id;
      //validation
      if(!courseId||!rating||!review){
        return res.status(400).json({success:false,message:'all fields are required'})
      }
      //check user is enrolled or not
    const courseDetails = await Course.findOne({
                                            id:courseId,
                                            studentEnrolled:{$elemMatch:{$eq:userId}}
                                          });
              if(!courseDetails){
                return res.status(400).json({message:'user not enrolled in this course'})
              }
              //check rating and review already exist or not
      const alreadyRatingAndReview = await RatingAndReview.findById(
                                                              {user:userId},
                                                              {course:courseId}
                                                              )
        if(alreadyRatingAndReview){
            return res.status(400).json({message:'you have already given the rating '})
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
  return res.status(500).json({success:false,message:'internal server error',error:error.message})
 }
}

export const getAverageRating = async (req,res)=>{
    try {
      //get courseId
      const{courseId}= req.body;
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
      return res.status(500).json({success:false,message:'internal server error'})
    }
  }

 export const getAllRating = async (req,res)=>{
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
      return res.status(200).json(
        {
          success:true,
          message:'all  review fetched successfully',
          data:allReview
        }
      )
              
  } catch (error) {
    return res.status(500).json({success:false,message:'internal server error'})
  }
  }