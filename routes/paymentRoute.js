import express from "express";
import{capturePayment,verifySignature} from "../controllers/paymentController.js"
  //middleware
  import {userAuth} from "../middlewares/authMiddleware.js"
const router = express.Router();
router.post("/createPayment",userAuth, capturePayment);
router.post("/payment-verify",userAuth, verifySignature);
export default router;
