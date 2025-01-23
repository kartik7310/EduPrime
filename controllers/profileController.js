import { Profile } from "../models/profileModel.js";
import {User} from '../models/userModel.js'
export const updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", about = "", contact, gender } = req.body;
    const userId = req.user.id; 

    if (!contact || !gender || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const profileId = user.additionDetails;
    const profileDetails = await Profile.findById(profileId);
    if (!profileDetails) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.about = about;

    await profileDetails.save();

    user.contact = contact;
    await user.save();

    return res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating profile", error: error.message });
  }
};

// explore -> how can we schedule this deletion operation and cron job

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const profileId = userDetails.additionDetails;

    // Delete profile
    await Profile.findByIdAndDelete(profileId);

    // Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting profile", error: error.message });
  }
};
export const getAllUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("additionDetails").exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "Data fetched successfully", data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching user details", error: error.message });
  }
};
