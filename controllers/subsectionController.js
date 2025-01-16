import { Section } from "../models/sectionModel.js";
import { SubSection } from "../models/subSectionModel.js";
import { uploadImage } from "../utils/imageUploder.js";
const createSubSection = async(req,res)=>{
  try {
 const{title,timeDuration,description,sectionId} = req.body;
 const video = req.files.videoFile;
 if(!title||!timeDuration||!description||!video||!sectionId)
  return res.status(400).json({message:'all fields are required'})
const uploadVideo = await uploadImage(video,process.env.FOLDER_NAME );
if(!uploadVideo){
  return res.status(400).json({message:'video not upload'})
}
const subSection = await SubSection.create({
                                          title,
                                          timeDuration,
                                          description,
                                         videoUrl:uploadVideo.secure_url
                                            })
      const updateSectionDetails = await Section.findByIdAndUpdate({sectionId},{
                                                                          $push:{
                                                                            subSection:subSection.id
                                                                          }
                                                                        },{new:true}).populate('SubSection');
                        return res.status(200).json({success:true,message:'subSection created successfully'})
  } catch (error) {
    return res.status(500).json({success:false,message:'enable to create subSection',error:error.message})
  }
}

// const updateSubSection = async(req,res)=>{
//   const{title,timeDuration,description,sectionId} = req.body;
//   if(!title||!timeDuration||!description||!sectionId){
//     return res.status(400).json({message:'all fields are required'})
//   }

// }

//todo: later
//update subsection controller
//delete subsection controller