import {User} from '../models/userModel.js';
import {Course} from '../models/courseModel.js'
import { uploadImage } from '../utils/imageUploder.js';
import { Category } from '../models/categoryModel.js';

export const createCourse = async(req,res)=>{

  try {
          const {courseName,courseDescription,whatYouWillLearn,price,tag} = req.body;
          const thumbnail = req.files.thumbnailImage;
            if(!courseName||!courseDescription||!whatYouWillLearn||!price||!tag||!thumbnail){
                return res.status(400).json({message:'all fields are required'})
            }
               const userId = req.user.id;
               const Instructor = await User.findById(userId);
             if(!Instructor){
                  return res.status(401).json({message:"Instructor not found"})
             }
                const tagDetails = await Category.findOne({name:tag});
                   if(!tagDetails){
                     return res.status(400).json({message:'tag details not found'})
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
              thumbnail:thumbnailImage.secure_url
            })
            //add the new course in the user schema of instructor
            await User.findOneAndUpdate({id:Instructor._id},{$push:{course:newCourse._id}},{new:true});
            //add the new course in the tag schema of instructor
            await Category.findByIdAndUpdate({id:tagDetails._id},{$push:{course:newCourse._id}},{new:true})
  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}



export const showAllCourses = async(req,res)=>{
  try {
    const coursed = await Course.find({},{
                                        courseName:true,
                                        price:true,
                                        thumbnail:true,
                                        instructor:true,
                                        studentEnrolled:true,
                                        ratingAndReviews:true
                                         }).populate('instructor').exec();
        return res.status(200) .json({success:'course fetched successfully'})                               
  } catch (error) {
    return res.status(500).json({success:false,message:error.message})
  }
}


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
      return res.status(500).json({success:false,message:'internal server error'})
  }
}