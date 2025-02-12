import {Category} from '../models/categoryModel.js'
import { errorHandler } from '../utils/error.js';
export const CreateCategory = async(req,res,next)=>{

     try {
        const { name ,description} = req.body;
          if(!name ||! description){
           return next(new(errorHandler(400,"all fields are required")))
          }
        const category = await Category.create({name,description})
       return res.status(400).json({
           success:true,
           message:'Category are created successfully'
       })
     } catch (error) {
       next(error)

      }
}

export const showAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.find({}, { name: true, description: true });

    if (!categories || categories.length === 0) {
      return next(new errorHandler(404, "No categories found"));
    }

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const CategoryPageDetails = async(req,res)=>{
  try {
    const {categoryId}= req.params;
    if(!categoryId){
      return next(new(errorHandler(400,"categoryId not provide")))
    }
    const category = await Category.findById(categoryId).populate('Course');
    if(!category){
     return next(new errorHandler('this category course not found'))
    }
    // get different category
    const differentCategory = await Category.find({
                                               _id: {
                                                $ne:categoryId
                                              }
                                            }).populate('Course').exec();
              return res.status(200).json({success:true,data:differentCategory})
  } catch (error) {
    next(error)
  }
} 