import { Profile } from "../models/profileModel.js";
import {User} from '../models/userModel.js'
import { errorHandler } from "../utils/error.js";
export const updateProfile = async (req, res,next) => {
  try {
    const { dateOfBirth = "", about = "", contact, gender } = req.body;
    const userId = req.user.id; 

    if (!contact || !gender || !userId) {
      return next(new errorHandler("All fields are required" ));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new errorHandler("user not found" ));
    }

    const profileId = user.additionDetails;
    const profileDetails = await Profile.findById(profileId);
    if (!profileDetails) {
      return next(new errorHandler("profile not found" ));
    }

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.about = about;

    await profileDetails.save();

    user.contact = contact;
    await user.save();

    return res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
   next(error)
  }
};

// explore -> how can we schedule this deletion operation and cron job

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return next(new errorHandler("user dose not exist" ));
    }

    const profileId = userDetails.additionDetails;

    // Delete profile
    await Profile.findByIdAndDelete(profileId);

    // Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    next(error)
  }
};
export const getAllUserDetails = async (req, res,next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("additionDetails").exec();

    if (!user) {
      return next(new errorHandler("use not found" ));
    }

    return res.status(200).json({ success: true, message: "Data fetched successfully", data: user });
  } catch (error) {
   next(error)
  }
};
