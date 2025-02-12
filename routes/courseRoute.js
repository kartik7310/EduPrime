import express from "express";
import { createCourse, showAllCourses, getCourseDetails } from "../controllers/courseController.js";
import { createRatingAndReview, getAverageRating, getAllRating } from "../controllers/ratingAndReviewController.js";
import { createSection, updateSection, deleteSection } from "../controllers/sectionController.js";
import { CreateCategory, showAllCategory, CategoryPageDetails } from "../controllers/catogoryController.js";

//middleware
import { userAuth, roleBasedAccess } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Course routes
router.post("/createCourse", userAuth, roleBasedAccess('Instructor'), createCourse);
router.get("/getCourses", showAllCourses);
router.get("/getCourseDetails/:id", getCourseDetails);


// Sections
router.post("/createSection", userAuth, roleBasedAccess('Instructor'), createSection);
router.patch("/updateSection", userAuth, roleBasedAccess('Instructor'), updateSection);
router.delete("/deleteSection", userAuth, roleBasedAccess('Instructor'), deleteSection);

// Category
router.post("/createCategory", userAuth, roleBasedAccess('Instructor'), CreateCategory);
router.get("/showAllCategories", showAllCategory);
router.get("/categoryPageDetails", CategoryPageDetails);

// Rating and Review
router.post("/createRating", userAuth, createRatingAndReview);
router.get("/getAvgRating", getAverageRating);
router.get("/getReview", getAllRating);

export default router;
