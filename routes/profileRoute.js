import express from "express";
import {updateProfile,deleteProfile,getAllUserDetails} from "../controllers/profileController.js";
import {userAuth} from "../middlewares/authMiddleware.js"
const router = express.Router();
router.put("/updateProfile",userAuth, updateProfile);
router.get("/getAllUserDetails",userAuth, getAllUserDetails);
router.delete("/deleteProfile",userAuth, deleteProfile);
export default router;
