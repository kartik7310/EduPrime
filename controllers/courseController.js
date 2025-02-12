import {User} from '../models/userModel.js';
import {Course} from '../models/courseModel.js'
import { uploadImage } from '../utils/imageUploder.js';

import { Category } from '../models/categoryModel.js';
import {errorHandler} from "../utils/error.js"


export const createCourse = async(req,res,next)=>{

  try {
          const {courseName,courseDescription,whatYouWillLearn,price,tag,CategoryId} = req.body;
          // const thumbnail = req.files.thumbnailImage;
          // console.log(thumbnail);
          
            if(!courseName||!courseDescription||!whatYouWillLearn||!price||!tag){
               return next(new errorHandler('all fields are required'))
            }
              
               const userId = req.user.id;
               if(!userId){
                return next(new errorHandler('userId not provide'))
               }
               const Instructor = await User.findById(userId);
             if(!Instructor){
                  return next(new errorHandler("Instructor not found"))
             }
                const categoryDetails = await Category.findById(CategoryId);
                   if(!categoryDetails){
                     return next(new errorHandler(404,'catogory details not ou'))
                  }
              const thumbnailImage = await uploadImage(thumbnail,process.env.FOLDER_NAME);
              if(!thumbnailImage  ){
                   return res.status(400).json({message:'thumbnail not upload '})
              }
            const newCourse = await Course.create({
              courseName,
              courseDescription,
              price,
              Category:tagDetails._id,
              instructor:Instructor._id,
              tag
              // thumbnail:thumbnailImage.secure_url
            })
            if(!newCourse){
              return next(new errorHandler("error while create course"))
            }
            //add the new course in the user schema of instructor
            await User.findOneAndUpdate({id:Instructor._id},{$push:{course:newCourse._id}},{new:true});
            //add the new course in the tag schema of instructor
            await Category.findByIdAndUpdate({id:tagDetails._id},{$push:{course:newCourse._id}},{new:true})
  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}


export const showAllCourses = async (req, res, next) => {
  try {
    // Parse query parameters
    const page = Number(req.query.page) || 1; // Default page = 1
    const limit = Number(req.query.limit) || 10; // Default limit = 10

    if (page <= 0 || limit <= 0) {
      return next(new errorHandler("Page and limit must be positive integers", 400));
    }

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Fetch paginated courses
    const courses = await Course.find(
      {}, // Filter (fetch all courses)
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        studentEnrolled: true,
        ratingAndReviews: true,
      }
    )
      .sort({ createdAt: -1 }) // Sort by latest courses
      .skip(skip) // Skip based on page
      .limit(limit) // Limit the number of results
      .populate("instructor", "name email") // Populate instructor details
      .exec();

    // Check if courses exist
    if (!courses || courses.length === 0) {
      return next(new errorHandler("No courses found", 404));
    }

    // Get the total number of courses
    const totalCourses = await Course.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalCourses / limit);

    // Return response
    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
      metaData: {
        totalCourses,
        totalPages,
        currentPage: page,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getCourseDetails = async(req,res)=>{
  try {
    const {courseId}  = req.body;
    const courseDetails =await Course.findById(courseId)
                                                          .populate({
                                                               path:'instructor',
                                                               populate:{
                                                                 path:'additionDetails'
                                                              },
                                                          })
                                                              .populate('Category')
                                                              .populate('ratingAndReviews')
                                                              .populate({
                                                                     path:'courseContent',
                                                                      populate:{
                                                                    path:'subSection'
                                                              },
                                                            })
                                                            .exec()
           if(!courseDetails){
            return res.status(400).json({
              success:false,
              message:`course not found with ${courseId}`
            })
           } 
              return res.status(200).json({
                success:true,
                message:'course fetched successfully',
                data:courseDetails
              })                                       
  }     catch (error) {
      next(error)
  }
}
