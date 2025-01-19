import express from "express";
import { createCourse, showAllCourses, getCourseDetails} from "../controllers/courseController.js"
import {createRatingAndReview,getAverageRating,getAllRating} from "../controllers/ratingAndReviewController.js"
import {createSection,updateSection,deleteSection}from "../controllers/sectionController.js"
import {CreateCategory,showAllCategory,CategoryPageDetails} from "../controllers/catogoryController.js"

//middleware
import {userAuth,roleBasedAccess} from "../middlewares/authMiddleware.js"
const router = express.Router();
//course routes
router.post("/createCourse",roleBasedAccess('Instructor'), createCourse);
router.get("/getCourse", showAllCourses);
router.get("/getCourseDetails", getCourseDetails);

//sections
router.post("/createSection",roleBasedAccess('Instructor'),createSection);
router.post("/updateSection",roleBasedAccess('Instructor'),updateSection);
router.post("/deleteSection",roleBasedAccess('Instructor'),deleteSection);

//Category
router.post("/CreateCategory",roleBasedAccess('Admin'),CreateCategory)
router.get("/showAllCategory",showAllCategory)
router.post("/CategoryPageDetails",CategoryPageDetails)
//rating and review
router.post("/createRating",userAuth,createRatingAndReview);
router.get("/getAvgRating",getAverageRating);
router.post("/getReview",getAllRating);
export default router;
