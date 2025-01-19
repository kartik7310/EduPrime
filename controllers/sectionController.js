import { Section } from "../models/sectionModel.js";
import { Course } from "../models/courseModel.js";
export const createSection = async(req,res)=>{
  try {
    const {sectionName,courseId}= req.body;
    if(!sectionName||!courseId){
      return res.status(400).json({message:'all fields are required'})
    }
    const section = await Section.create({sectionName});
    const updateCourseDetails = await Course.findByIdAndUpdate({courseId},
                                                      {$push:{
                                                        courseContent:section.id}}
                                                    
                                                  ).populate('Section').populate('Subsection')
     return res.status(200).json({success:true,message:'section created successfully'})
                                                    
  } catch (error) {
    return res.status(500).json({success:false,message:'enable to create section',error:error.message})
  }
}

export const updateSection = async(req,res)=>{
 try {
   const {sectionName,sectionId} = req.body;
   if(!sectionName||!sectionId){
     return res.status(400).json({message:'all fields are required'})
   }
   const updateSection = await Section.findByIdAndUpdate({sectionId},{sectionName},{new:true});
   return res.status(200).json({success:true,message:'section updated successfully'})
 } catch (error) {
  return res.status(500).json({success:false,message:'enable to update section',error:error.message})
 }

 
}
export const deleteSection = async(req,res)=>{
  try {
    const {sectionId} = req.params;
    if(!sectionId){
      return res.status(400).json({message:'sectionId not provide'})
    }
    const deleteSection = await Section.findByIdAndDelete({sectionId});
    return res.status(200).json({success:true,message:'section delete successfully'})
  } catch (error) {
    return res.status(500).json({success:false,message:'enable to delete section',error:error.message})
  }
 }
