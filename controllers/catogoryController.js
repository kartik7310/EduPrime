import {Tag} from '../models/categoryModel.js'

const CreateCategory = async(req,res)=>{

     try {
        const { name ,description} = req.body;
          if(!name ||! description){
            return res.status(400).json({
              message:'all fields are required'
            })
          }
        const tag = await Tag.create({name,description})
       return res.status(400).json({
           success:true,
           message:'tags are created successfully'
       })
     } catch (error) {
        return res.status(500).json({
          success:false,
          message:error.message
        })

      }
}

const getAllTags = async(req,res)=>{
     try {
          const category = await Tag.find({},{name:true,description:true});
          return res.status(200).json({success:true,message:'tags fetch successfully'})
     }   catch (error) {
         return res.status(500).json({
         success:false,
         message:error.message
  
      })
     }
}