import {Category, Tag} from '../models/categoryModel.js'

export const CreateCategory = async(req,res)=>{

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

export const showAllCategory = async(req,res)=>{
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

export const CategoryPageDetails = async(req,res)=>{
  try {
    const {categoryId}= req.body;
    const category = await Category.findById({categoryId}).populate('Course');
    if(!category){
      return res.status(404).json({message:'this category course not found'})
    }
    // get different category
    const differentCategory = await Category.find({
                                               _id: {
                                                $neq:categoryId
                                              }
                                            }).populate('Course').exec();
              return res.status(200).json({success:true,data:category,differentCategory})
  } catch (error) {
    return res.status(500).json({success:false,message:'internal server error'})
  }
} 