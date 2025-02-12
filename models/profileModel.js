import mongoose from "mongoose";
const profileSchema = new mongoose.Schema({
  gender: { type: String },
  dateOfBirth: { type: String },
  about: { type: String, trim: true },
  contact: { type: String, trim: true },
});
export const Profile = mongoose.model("Profile", profileSchema);
