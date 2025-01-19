import { Profile } from "../models/profileModel.js";
import {User} from '../models/userModel.js'

export const updateProfile = async(req,res)=>{
  try {
          const{dateOfBirth = "",about= "" ,contact,gender} = req.body;
          const userId = req.user;
          if(!contact||!gender||!userId){
               return res.status(400).json({message:'all fields are required'})
          }
              const user = await User.findOne(userId);
              const profileId = user.additionDetails;
              const profileDetails = await Profile.findOne({profileId})
          if(!user){
               return res.status(401).json({message:'user not found'})
          }
              profileDetails.dateOfBirth= dateOfBirth;
              profileDetails.gender = gender;
              profileDetails.contact = contact;
              profileDetails.about = about;

           await profileDetails.save();

           return res.status(200).json({success:true,message:'profile update successfully'})
  } catch (error) {
         return res.status(500).json({success:false,message:'error while update profile',error:error.message})
  }
}

// explore -> how can we schedule this deletion operation and cron job

export const deleteProfile = async(req,res) =>{
  try {
         const userId = req.user.id;
        const userDetails = await User.findById({userId});
        if(!userDetails){
         return res.status(400).json({message:'user not exist'})
   }
   const profileId = userDetails.additionDetails;
   await Profile.findByIdAndDelete({profileId})

   //todo: unenroll user from all enrolled courses
   await User.findByIdAndDelete({userId});
   return res.status(200).json({success:true,message:'profile delete successfully'})
    } catch (error) {
    return res.status(500).json({success:false,message:'error while delete profile',error:error.message})
  }
}

export const getAllUserDetails = async(req,res)=>{
  try {
    const userId = req.user.id;
    const user = await User.findById({userId}).populate('additionDetails').exec();
    if(!user){
      return res.status(400).json({message:' '})
    }
    return res.status(200).json({success:true,message:'data fetch successfully'})
  } catch (error) {
    return res.status(500).json({success:false,error:error.message})
  }
}