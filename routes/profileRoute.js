import express from "express";
import {updateProfile,deleteProfile,getAllUserDetails} from "../controllers/profileController.js";
import {userAuth} from "../middlewares/authMiddleware.js"
const router = express.Router();
router.post("/updateProfile",userAuth, updateProfile);
router.get("/getAllUserDetails",userAuth, getAllUserDetails);
router.post("/deleteProfile",userAuth, deleteProfile);
export default router;
