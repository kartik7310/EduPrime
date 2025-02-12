import {cloudinary} from "../config/cloudinary.js"
export const uploadImage = async (file, folder, height, quality) => {
  const option = { folder };
  if (height) option.height = height;
  if (quality) option.quality = quality;
  option.resource_type = "auto";
  return cloudinary.uploader.upload(file.tempFilePath, option);
};
