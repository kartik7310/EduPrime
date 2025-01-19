import express from "express";
import {signup,login,changePassword} from "../controllers/authController.js";
import {sendPasswordResetLink,resetPassword} from "../controllers/resetPasswordController.js"

import {userAuth} from "../middlewares/authMiddleware.js"
const router = express.Router();

//signup ,login and changePassword
router.post("/signup", signup);
router.post("/login", login);
router.post("/changePassword", userAuth,changePassword);

//resetPassword 
router.post("/sendPasswordResetLink",userAuth, sendPasswordResetLink);
router.post("/resetPassword",userAuth, resetPassword);
export default router;
